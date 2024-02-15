import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, Transaction } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import bs58 from 'bs58'
import { Address } from 'everscale-inpage-provider'
import { type IReactionDisposer, action, computed, makeObservable, reaction } from 'mobx'
import * as uuid from 'uuid'
import Web3 from 'web3'

import {
    Compounder,
    EventClosers,
    EverSafeAmount,
    Mediator,
    Unwrapper,
    WEVEREvmRoots,
    WEVERRootAddress,
    WEVERVaultAddress,
    networks,
} from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import { BridgeUtils, EthAbi } from '@/misc'
import {
    ethereumEventConfigurationContract,
    everSolEventConfigurationContract,
    everscaleEventConfigurationContract,
    getFullContractState,
    tokenWalletContract,
    wrappedCoinVaultContract,
} from '@/misc/contracts'
import { erc20TokenContract, evmMultiVaultContract } from '@/misc/eth-contracts'
import { type EverscaleToken, EvmToken, Pipeline } from '@/models'
import {
    BurnType,
    CrosschainBridgeStep,
    type CrosschainBridgeStoreData,
    type CrosschainBridgeStoreState,
    type NetworkFields,
    type PendingWithdrawal,
    TransitOperation,
} from '@/modules/Bridge/types'
import {
    findAssociatedTokenAddress,
    getPrice,
    getUnwrapPayload,
    ixFromRust,
} from '@/modules/Bridge/utils'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAsset, type BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type SolanaWalletService } from '@/stores/SolanaWalletService'
import { type NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    getEverscaleMainNetwork,
    getRandomUint,
    isEverscaleAddressValid,
    isEvmAddressValid,
    isGoodBignumber,
    isSolanaAddressValid,
    storage,
    throwException,
    validateMaxValue,
    validateMinValue,
} from '@/utils'
import initBridge, { depositSol } from '@/wasm/bridge'

export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA: CrosschainBridgeStoreData = {
    amount: '',
    leftAddress: '',
    rightAddress: '',
}

export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE: CrosschainBridgeStoreState = {
    approvalStrategy: 'infinity',
    isCalculating: false,
    isFetching: false,
    isLocked: false,
    isPendingAllowance: false,
    isPendingApproval: false,
    isProcessing: false,
    step: CrosschainBridgeStep.SELECT_ROUTE,
}

const eventClosers = EventClosers.map(addr => addr.toString().toLowerCase())

export class CrosschainBridge extends BaseStore<CrosschainBridgeStoreData, CrosschainBridgeStoreState> {

    /*
     * Public actions. Useful in UI
     * ----------------------------------------------------------------------------------
     */

    constructor(
        public readonly evmWallet: EvmWalletService,
        public readonly tvmWallet: EverWalletService,
        public readonly solanaWallet: SolanaWalletService,
        public readonly bridgeAssets: BridgeAssetsService,
    ) {
        super()

        this.reset()

        makeObservable<
            CrosschainBridge,
            | 'amountNumber'
            | 'handleEvmPendingWithdrawal'
            | 'handleEvmWalletConnection'
            | 'handleTvmWalletConnection'
            | 'handleSolanaWalletConnection'
        >(this, {
            amount: computed,
            amountMinDecimals: computed,
            amountNumber: computed,
            approvalStrategy: computed,
            balance: computed,
            decimals: computed,
            depositFee: computed,
            evmPendingWithdrawal: computed,
            evmTokenDecimals: computed,
            evmTvmCost: computed,
            expectedEversAmount: computed,
            expectedEversAmountNumber: computed,
            gasPrice: computed,
            gasUsage: computed,
            handleEvmPendingWithdrawal: action.bound,
            handleEvmWalletConnection: action.bound,
            handleSolanaWalletConnection: action.bound,
            handleTvmWalletConnection: action.bound,
            isAmountMaxValueValid: computed,
            isAmountMinValueValid: computed,
            isAmountValid: computed,
            isAmountVaultLimitExceed: computed,
            isAssetValid: computed,
            isCalculating: computed,
            isEnoughComboBalance: computed,
            isEnoughEverBalance: computed,
            isEnoughEvmBalance: computed,
            isEnoughTvmBalance: computed,
            isEnoughWeverBalance: computed,
            isEvmEvm: computed,
            isEvmTvm: computed,
            isExpectedEversAmountValid: computed,
            isFetching: computed,
            isFromEvm: computed,
            isFromSolana: computed,
            isFromTvm: computed,
            isInsufficientVaultBalance: computed,
            isLocked: computed,
            isNativeEvmCurrency: computed,
            isNativeTvmCurrency: computed,
            isPendingAllowance: computed,
            isPendingApproval: computed,
            isRouteValid: computed,
            isSolanaTvm: computed,
            isSwapEnabled: computed,
            isTvmBasedToken: computed,
            isTvmEvm: computed,
            isTvmSolana: computed,
            leftAddress: computed,
            leftNetwork: computed,
            maxAmount: computed,
            maxExpectedEversAmount: computed,
            maxTransferFee: computed,
            minAmount: computed,
            minEversAmount: computed,
            minTransferFee: computed,
            pendingWithdrawals: computed,
            pendingWithdrawalsAmount: computed,
            pendingWithdrawalsBounty: computed,
            pipeline: computed,
            rightAddress: computed,
            rightNetwork: computed,
            rightNetworks: computed,
            secondDepositFee: computed,
            secondPipeline: computed,
            secondWithdrawFee: computed,
            step: computed,
            token: computed,
            tokens: computed,
            tvmEvmCost: computed,
            txHash: computed,
            vaultBalance: computed,
            vaultBalanceDecimals: computed,
            vaultLimitNumber: computed,
            withdrawFee: computed,
        })
    }

    /**
     * Manually initiate store.
     * Run all necessary reaction subscribers.
     */
    public init(): VoidFunction {
        this.evmWalletDisposer = reaction(
            () => this.evmWallet.address,
            this.handleEvmWalletConnection,
            { fireImmediately: this.evmWallet.isConnected },
        )

        this.tvmWalletDisposer = reaction(
            () => this.tvmWallet.address,
            this.handleTvmWalletConnection,
            { fireImmediately: this.tvmWallet.isConnected },
        )

        this.solanaWalletDisposer = reaction(
            () => this.solanaWallet.address,
            this.handleSolanaWalletConnection,
            { fireImmediately: this.solanaWallet.isConnected },
        )

        this.evmPendingWithdrawalDisposer = reaction(
            () => this.evmPendingWithdrawal,
            this.handleEvmPendingWithdrawal,
            { fireImmediately: true },
        )

        return () => this.dispose()
    }

    /**
     * Manually dispose of all reaction subscribers.
     * Reset all data to their defaults.
     */
    public dispose(): void {
        this.evmWalletDisposer?.()
        this.tvmWalletDisposer?.()
        this.solanaWalletDisposer?.()
        this.evmPendingWithdrawalDisposer?.()
        this.reset()
    }

    /*
     * Form fields handlers
     * ----------------------------------------------------------------------------------
     */

    /**
     * Change network by the given key and value.
     * @template {string} K
     * @param {K extends keyof NetworkFields} key
     * @param {NetworkShape} [value]
     */
    public changeNetwork<K extends keyof NetworkFields>(key: K, value?: NetworkShape): void {
        if (value === undefined) {
            return
        }

        if (key === 'leftNetwork') {
            const { leftAddress } = this

            if (value.type === 'tvm') {
                const address = isEverscaleAddressValid(this.leftAddress)
                    ? this.leftAddress
                    : this.tvmWallet.address
                this.setData('leftAddress', address || '')
            }
            else if (value.type === 'evm') {
                const address = isEvmAddressValid(this.leftAddress)
                    ? this.leftAddress
                    : this.evmWallet.address
                this.setData('leftAddress', address || '')
                if (this.rightNetwork?.type === 'solana') {
                    this.setData('rightNetwork', undefined)
                }
            }

            if (value.id === this.rightNetwork?.id) {
                this.setData({
                    rightAddress: leftAddress,
                    rightNetwork: this.leftNetwork,
                })
            }
        }
        else if (key === 'rightNetwork') {
            if (value.type === 'tvm') {
                const rightAddress = isEverscaleAddressValid(this.rightAddress)
                    ? this.rightAddress
                    : this.tvmWallet.address
                this.setData('rightAddress', rightAddress || '')
            }
            else if (value.type === 'evm') {
                const rightAddress = isEvmAddressValid(this.rightAddress)
                    ? this.rightAddress
                    : this.evmWallet.address
                this.setData('rightAddress', rightAddress || '')
            }

            if (value.id === this.leftNetwork?.id) {
                if (this.rightNetwork?.type === 'tvm') {
                    this.setData('leftAddress', this.tvmWallet.address || '')
                }
                else if (this.rightNetwork?.type === 'evm') {
                    this.setData('leftAddress', this.evmWallet.address || '')
                }

                this.setData('leftNetwork', this.rightNetwork)
            }
        }

        this.setData(key, value)
    }

    /**
     * Change token by the given token address and start to resolve pipeline
     * @param {string} address
     * @returns {Promise<void>}
     */
    public async changeToken(address: string): Promise<void> {
        this.resetAsset()

        this.setData('selectedToken', address)

        if (
            this.token?.root === undefined
            || this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.rightNetwork?.type === undefined
            || this.rightNetwork?.chainId === undefined
        ) {
            return
        }

        const everscaleMainNetwork = getEverscaleMainNetwork()

        try {
            this.setState('isFetching', true)
            const pipeline = await this.bridgeAssets.pipeline(
                this.token.root,
                `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                this.isEvmEvm
                    ? `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`
                    : `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            )

            if (pipeline === undefined) {
                this.setState('isLocked', true)
                return
            }

            if (this.isEvmEvm && pipeline?.everscaleTokenAddress !== undefined) {
                const secondPipeline = await this.bridgeAssets.pipeline(
                    pipeline.everscaleTokenAddress.toString(),
                    `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                    `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                )

                if (secondPipeline === undefined) {
                    this.setState('isLocked', true)
                    return
                }

                this.setData({
                    pipeline: new Pipeline(pipeline),
                    secondPipeline: new Pipeline(secondPipeline),
                })
            }
            else {
                this.setData('pipeline', new Pipeline(pipeline))
            }
        }
        catch (e) {
            error(e)
            this.setState('isLocked', true)
        }
        finally {
            this.setState('isFetching', false)
            debug('Current pipeline', this.pipeline, this.secondPipeline)
        }

        if (this.isFromEvm && this.isNativeEvmCurrency) {
            if (this.leftNetwork.chainId === this.evmWallet.chainId) {
                (this.token as EvmToken)?.setData('balance', this.evmWallet.balance)
                this.pipeline?.setData('evmTokenBalance', this.evmWallet.balance)
                this.pipeline?.setData('evmTokenDecimals', this.evmWallet.coin.decimals)
            }
        }
        else if (this.isFromTvm && this.isNativeTvmCurrency) {
            this.pipeline?.setData(
                'everscaleTokenBalance',
                BigNumber(this.tvmWallet.balance || 0).plus(this.token?.balance ?? 0).toFixed(),
            )
            this.pipeline?.setData('everscaleTokenDecimals', this.tvmWallet.coin.decimals)
        }

        await this.handleEvmPendingWithdrawal()
        await this.switchToCredit()
    }

    public async getGasUsage(): Promise<number> {
        let gasUsage = 1_700_000

        if (this.pipeline?.evmTokenAddress) {
            if (this.pipeline.isNative) {
                try {
                    const network = findNetwork(this.pipeline.chainId, 'evm')
                    if (network) {
                        // if token exists in evm
                        await BridgeUtils.getEvmTokenSymbol(
                            this.pipeline.evmTokenAddress,
                            network.rpcUrl,
                        )
                        gasUsage = 500_000
                    }
                }
                catch (e) {
                    debug('Token not deployed => gas usage is ', gasUsage)
                }
            }
            else {
                gasUsage = 600_000
            }
        }

        return gasUsage
    }

    public async getSecondGasUsage(): Promise<number> {
        let gasUsage = 1_700_000

        if (this.secondPipeline?.evmTokenAddress) {
            if (this.secondPipeline.isNative) {
                try {
                    const network = findNetwork(this.secondPipeline.chainId, 'evm')
                    if (network) {
                        // if token exists in evm
                        await BridgeUtils.getEvmTokenSymbol(
                            this.secondPipeline.evmTokenAddress,
                            network.rpcUrl,
                        )
                        return 500_000
                    }
                }
                catch {
                    debug('[EVM EVM] Token not deployed => gas usage is ', gasUsage)
                }
            }
            else {
                gasUsage = 600_000
            }
        }

        return gasUsage
    }

    public async getInitialBalance(): Promise<number> {
        const eventInitialBalance = 6_000_000_000

        if (!this.pipeline?.ethereumConfiguration) {
            return eventInitialBalance
        }

        try {
            const result = await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
            .methods.getDetails({ answerId: 0 })
            .call()
            return result._basicConfiguration.eventInitialBalance
                ? Number(result._basicConfiguration.eventInitialBalance)
                : eventInitialBalance
        }
        catch {}

        return eventInitialBalance
    }

    public async switchToCredit(): Promise<void> {
        if (!this.pipeline?.chainId) {
            throwException('Source network chainId not defined')
        }

        this.setState('isSwapEnabled', true)

        try {
            this.setState('isCalculating', true)

            const network = findNetwork(this.pipeline.chainId, 'evm')

            if (network === undefined) {
                throwException('Network config not defined')
            }

            let rate = '0'

            if (this.isFromEvm) {
                rate = await getPrice(this.leftNetwork!.currencySymbol.toUpperCase())
            }
            else if (this.isFromTvm) {
                rate = await getPrice(this.rightNetwork!.currencySymbol.toUpperCase())
            }

            let web3 = new Web3(network.rpcUrl)

            const [eventInitialBalance = 6_000_000_000, gasPrice = '0', gasUsage] = await Promise.all([
                this.getInitialBalance(),
                web3.eth.getGasPrice(),
                this.getGasUsage(),
            ])

            let gasPriceNumber = BigNumber(gasPrice || 0)
                .times(gasUsage)
                .shiftedBy(-this.evmWallet.coin.decimals)
                .times(rate)
                .times(1.2)
                .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                .shiftedBy(this.tvmWallet.coin.decimals)

            try {
                if (this.pipeline.everscaleTokenAddress) {
                    const state = await getFullContractState(this.pipeline.everscaleTokenAddress)
                    if (!state?.isDeployed) {
                        debug('Token not deployed: + 1 expected evers')
                        gasPriceNumber = gasPriceNumber.plus(1_000_000_000)
                    }
                }
                else {
                    debug('Token not deployed: + 1 expected evers')
                    gasPriceNumber = gasPriceNumber.plus(1_000_000_000)
                }
            }
            catch (e) {
                debug('Token not deployed: + 1 expected evers')
                gasPriceNumber = gasPriceNumber.plus(1_000_000_000)
            }

            if (this.isEvmEvm) {
                const targetNetwork = this.secondPipeline?.chainId
                    ? findNetwork(this.secondPipeline.chainId, 'evm')
                    : undefined

                if (targetNetwork) {
                    web3 = new Web3(targetNetwork.rpcUrl)
                    const [_rate, _gasPrice = '0', _gasUsage] = await Promise.all([
                        getPrice(targetNetwork.currencySymbol.toLowerCase()),
                        web3.eth.getGasPrice(),
                        this.getSecondGasUsage(),
                    ])
                    gasPriceNumber = gasPriceNumber.plus(
                        BigNumber(_gasPrice || 0)
                        .times(_gasUsage)
                        .shiftedBy(-this.evmWallet.coin.decimals)
                        .times(_rate)
                        .times(1.2) // +20%
                        .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                        .shiftedBy(this.tvmWallet.coin.decimals),
                    )
                }
            }

            this.setData({
                eventInitialBalance,
                evmGas: gasPrice,
                gasPrice: gasPriceNumber.toFixed(),
                gasUsage: gasUsage.toString(),
                rate,
            })
        }
        catch (e) {
            this.setState('isLocked', true)
        }
        finally {
            this.setState('isCalculating', false)
        }
    }

    public async switchToDefault(): Promise<void> {
        this.setState('isSwapEnabled', false)
        this.setData({
            expectedEversAmount: undefined,
            gasPrice: undefined,
            gasUsage: undefined,
            rate: undefined,
        })
    }

    /*
     * Transactions handlers
     * ----------------------------------------------------------------------------------
     */

    /**
     * Check allowance.
     * If the given `approvalDelta` less than 0 - we should display approval
     * amount step, otherwise step with transfer form.
     */
    public async checkAllowance(): Promise<void> {
        if (
            this.token === undefined
            || this.pipeline?.chainId === undefined
            || this.pipeline.evmTokenAddress === undefined
            || this.pipeline.evmTokenDecimals === undefined
        ) {
            return
        }

        const network = findNetwork(this.pipeline.chainId, 'evm')

        if (network === undefined) {
            return
        }

        this.setState('isPendingAllowance', true)

        try {
            const allowance = await erc20TokenContract(this.pipeline.evmTokenAddress, network.rpcUrl)
            .methods.allowance(this.evmWallet.address, this.pipeline.vaultAddress)
            .call()

            const approvalDelta = BigNumber(allowance).minus(
                this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals).dp(0, BigNumber.ROUND_DOWN),
            )

            if (approvalDelta.lt(0)) {
                this.setState('step', CrosschainBridgeStep.SELECT_APPROVAL_STRATEGY)
            }
            else {
                this.setState('step', CrosschainBridgeStep.TRANSFER)
            }
        }
        catch (e) {
            error('Check allowance error', e)
        }
        finally {
            this.setState('isPendingAllowance', false)
        }
    }

    /**
     * Approve amount, using approval strategies:
     * - `infinity` - approve once and never ask again, otherwise
     * - `fixed` - only for current transaction.
     */
    public async approveAmount(): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.leftNetwork === undefined
                || this.rightNetwork === undefined
                || this.pipeline?.chainId === undefined
                || this.pipeline.evmTokenDecimals === undefined
                || this.pipeline.evmTokenAddress === undefined
            ) {
                return
            }

            this.setState('isPendingApproval', true)

            try {
                attempts += 1

                const tokenContract = new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, this.pipeline.evmTokenAddress)

                let r

                if (this.approvalStrategy === 'infinity') {
                    r = tokenContract.methods.approve(
                        this.pipeline.vaultAddress.toString(),
                        '340282366920938463426481119284349108225',
                    )
                }
                else {
                    r = tokenContract.methods.approve(
                        this.pipeline.vaultAddress.toString(),
                        this.amountNumber
                        .shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    )
                }

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                    this.setState('step', CrosschainBridgeStep.TRANSFER)
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined
                    && transactionType !== '0x0'
                ) {
                    error('Approve error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    error('Approve error', e)
                }
            }
            finally {
                this.setState('isPendingApproval', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Deposit EVM token to the TVM with credit and additional TVM Native currency amount
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async depositWithCredit(reject?: (e: any) => void): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
            ) {
                return
            }

            const network = findNetwork(this.pipeline.chainId, 'evm')

            if (network === undefined) {
                return
            }

            try {
                this.setState('isProcessing', true)

                attempts += 1

                let target = this.rightAddress.split(':')

                const vaultContract = new this.evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress.toString(),
                )

                const eventInitialBalance = await this.getInitialBalance()

                const amount = this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed()

                let payload: string | undefined,
                    { evmTokenAddress } = this.pipeline

                if (this.isNativeTvmCurrency) {
                    try {
                        const meta = await BridgeUtils.getEvmMultiVaultTokenMeta(
                            this.pipeline.vaultAddress.toString(),
                            evmTokenAddress!,
                            network.rpcUrl,
                        )

                        if (meta.custom === '0x0000000000000000000000000000000000000000') {
                            evmTokenAddress = await BridgeUtils.getEvmMultiVaultNativeToken(
                                this.pipeline.vaultAddress.toString(),
                                this.pipeline.everscaleTokenAddress!,
                                network.rpcUrl,
                            )
                        }
                    }
                    catch (e) {
                        error('Can not fetch custom token meta', e)
                    }

                    const response = await getUnwrapPayload({
                        amount: this.amountNumber
                        .minus(this.depositFee || 0)
                        .shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                        destination: this.rightAddress,
                        remainingGasTo: this.tvmWallet.address ?? this.rightAddress,
                    })

                    target = response.sendTo.split(':')
                    payload = Buffer.from(response.tokensTransferPayload, 'base64').toString('hex')
                }

                const expectedEvers = this.expectedEversAmountNumber
                    .shiftedBy(this.tvmWallet.coin.decimals)
                    .plus(eventInitialBalance ?? 0)

                const rate = await getPrice(this.leftNetwork?.currencySymbol.toLowerCase() as string)

                const value = expectedEvers
                    .shiftedBy(-this.tvmWallet.coin.decimals)
                    .div(rate)
                    .times(1.2)
                    .shiftedBy(this.evmWallet.coin.decimals)
                    .dp(0, BigNumber.ROUND_DOWN)

                const args: any[] = [
                    [
                        /* recipient */
                        [target[0], `0x${target[1]}`],
                        /* token */
                        evmTokenAddress,
                        /* amount */
                        amount,
                        /* expected_evers */
                        expectedEvers.toFixed(),
                        /* payload */
                        payload === undefined ? [] : `0x${payload}`,
                    ],
                ]

                if (this.pendingWithdrawalsBounty && this.pendingWithdrawals) {
                    args.push(
                        this.pendingWithdrawalsBounty,
                        this.pendingWithdrawals.map(item => ({
                            id: item.id,
                            recipient: item.recipient,
                        })),
                    )
                }

                const r = vaultContract.methods.deposit(...args)

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                        value: value.toFixed(),
                    })

                    await r
                    .send({
                        from: this.evmWallet.address,
                        gas,
                        type: transactionType,
                        value: value.toFixed(),
                    })
                    .once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined
                    && transactionType !== '0x0'
                ) {
                    debug('Deposit with Credit error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Deposit with Credit error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Deposit EVM Native currency to the MultiVault that will be transferred to the TVM
     *
     * - ETH, BNB, MATIC, etc
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async depositEvmNativeCurrency(reject?: (e: any) => void): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
            ) {
                return
            }

            const network = findNetwork(this.pipeline.chainId, 'evm')

            if (network === undefined) {
                return
            }

            try {
                this.setState('isProcessing', true)

                attempts += 1

                const target = this.rightAddress.split(':')

                const vaultContract = new this.evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress.toString(),
                )

                const eventInitialBalance = await this.getInitialBalance()

                const amount = this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed()

                const expectedEvers = this.expectedEversAmountNumber
                    .shiftedBy(this.tvmWallet.coin.decimals)
                    .plus(eventInitialBalance ?? 0)

                const args: any[] = [
                    [
                        /* recipient */
                        [target[0], `0x${target[1]}`],
                        /* amount */
                        amount,
                        /* expected_evers */
                        this.isSwapEnabled ? expectedEvers.toFixed() : 0,
                        /* payload */
                        [],
                    ],
                ]

                if (this.pendingWithdrawalsBounty && this.pendingWithdrawals) {
                    args.push(
                        this.pendingWithdrawalsBounty,
                        this.pendingWithdrawals.map(item => ({
                            id: item.id,
                            recipient: item.recipient,
                        })),
                    )
                }

                const r = vaultContract.methods.depositByNativeToken(...args)

                let value = this.amountNumber.shiftedBy(this.evmWallet.coin.decimals)

                if (this.isSwapEnabled) {
                    const rate = await getPrice(this.leftNetwork?.currencySymbol.toLowerCase() as string)

                    value = value.plus(
                        expectedEvers
                        .shiftedBy(-this.tvmWallet.coin.decimals)
                        .div(rate)
                        .times(1.2)
                        .shiftedBy(this.evmWallet.coin.decimals)
                        .dp(0, BigNumber.ROUND_DOWN),
                    )
                }

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                        value: value.toFixed(),
                    })

                    await r
                    .send({
                        from: this.evmWallet.address,
                        gas,
                        type: transactionType,
                        value: value.toFixed(),
                    })
                    .once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined
                    && transactionType !== '0x0'
                ) {
                    error('Deposit EVM Native Currency error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Deposit EVM Native Currency error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Deposit EVM token to the MultiVault that will be transferred to the TVM
     *
     * - USDT, USDC
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async depositToken(reject?: (e: any) => void): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
            ) {
                return
            }

            const network = findNetwork(this.pipeline.chainId, 'evm')

            if (network === undefined) {
                return
            }

            try {
                this.setState('isProcessing', true)

                attempts += 1

                let target = this.rightAddress.split(':')

                const vaultContract = new this.evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress.toString(),
                )

                const amount = this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed()

                let payload: string | undefined,
                    { evmTokenAddress } = this.pipeline

                if (this.isNativeTvmCurrency) {
                    try {
                        const meta = await BridgeUtils.getEvmMultiVaultTokenMeta(
                            this.pipeline.vaultAddress.toString(),
                            evmTokenAddress!,
                            network.rpcUrl,
                        )

                        if (meta.custom === '0x0000000000000000000000000000000000000000') {
                            evmTokenAddress = await BridgeUtils.getEvmMultiVaultNativeToken(
                                this.pipeline.vaultAddress.toString(),
                                this.pipeline.everscaleTokenAddress!,
                                network.rpcUrl,
                            )
                        }
                    }
                    catch (e) {
                        error('Can not fetch custom token meta', e)
                    }

                    const response = await getUnwrapPayload({
                        amount: this.amountNumber
                        .minus(this.depositFee || 0)
                        .shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                        destination: this.rightAddress,
                        remainingGasTo: this.tvmWallet.address ?? this.rightAddress,
                    })

                    target = response.sendTo.split(':')
                    payload = Buffer.from(response.tokensTransferPayload, 'base64').toString('hex')
                }

                const args: any[] = [
                    [
                        /* recipient */
                        [target[0], `0x${target[1]}`],
                        /* token */
                        evmTokenAddress,
                        /* amount */
                        amount,
                        /* expected_evers */
                        0,
                        /* payload */
                        payload === undefined ? [] : `0x${payload}`,
                    ],
                ]

                if (this.pendingWithdrawalsBounty && this.pendingWithdrawals) {
                    args.push(
                        this.pendingWithdrawalsBounty,
                        this.pendingWithdrawals.map(item => ({
                            id: item.id,
                            recipient: item.recipient,
                        })),
                    )
                }

                const r = vaultContract.methods.deposit(...args)

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })

                    await r
                    .send({
                        from: this.evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                    .once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined
                    && transactionType !== '0x0'
                ) {
                    error('Deposit Token error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Deposit Token error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Transfer TVM-native token to the EVM
     *
     * - QUBE, BRIDGE
     * - Token that base chainId is not equals to target EVM network chainId
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async transferTvmNativeToken(reject?: (e: any) => void): Promise<void> {
        if (
            this.tvmWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.tvmWallet.account?.address === undefined
        ) {
            return
        }

        const subscriber = new staticRpc.Subscriber()

        try {
            this.setState('isProcessing', true)

            const walletContract = tokenWalletContract((this.token as EverscaleToken).wallet as Address)
            const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)

            const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
            const startLt = everscaleConfigState?.lastTransactionId?.lt

            const eventStream = subscriber
                .transactions(everscaleConfigContract.address)
                .flatMap(item => item.transactions)
                .filter(tx => !startLt || tx.id.lt > startLt)
                .filterMap(async tx => {
                    const decodedTx = await everscaleConfigContract.decodeTransaction({
                        methods: ['deployEvent'],
                        transaction: tx,
                    })

                    if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                        const { eventData } = decodedTx.input.eventVoteData
                        const event = await staticRpc.unpackFromCell({
                            allowPartial: true,
                            boc: eventData,
                            structure: [
                                { name: 'nonce', type: 'uint32' },
                                { name: 'proxy', type: 'address' },
                                { name: 'tokenWallet', type: 'address' },
                                { name: 'token', type: 'address' },
                                { name: 'remainingGasTo', type: 'address' },
                                { name: 'amount', type: 'uint128' },
                                { name: 'recipient', type: 'uint160' },
                                { name: 'chainId', type: 'uint256' },
                            ] as const,
                        })
                        const checkEvmAddress = `0x${BigNumber(event.data.recipient)
                            .toString(16)
                            .padStart(40, '0')}`

                        if (
                            [...eventClosers, this.leftAddress!.toLowerCase()].includes(
                                event.data.remainingGasTo.toString().toLowerCase(),
                            )
                            && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                        ) {
                            const eventAddress = await everscaleConfigContract.methods
                            .deriveEventAddress({
                                answerId: 0,
                                eventVoteData: decodedTx.input.eventVoteData,
                            })
                            .call()

                            return eventAddress.eventContract
                        }
                        return undefined
                    }
                    return undefined
                })
                .first()

            /* eslint-disable sort-keys */
            const transferPayload = await staticRpc.packIntoCell({
                data: {
                    addr: this.rightAddress,
                    chainId: this.rightNetwork.chainId,
                    callback: {
                        recipient: '0x0000000000000000000000000000000000000000',
                        payload: '',
                        strict: false,
                    },
                },
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
                        name: 'callback',
                        type: 'tuple',
                    },
                ] as const,
            })

            const data = await staticRpc.packIntoCell({
                data: {
                    nonce: getRandomUint(),
                    network: 1,
                    transferPayload: transferPayload.boc,
                },
                structure: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'network', type: 'uint8' },
                    { name: 'transferPayload', type: 'cell' },
                ] as const,
            })
            /* eslint-enable sort-keys */

            const eventInitialBalance = await this.getInitialBalance()

            let attachedAmount = BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const network = findNetwork(this.pipeline.chainId, 'evm')

                if (network === undefined) {
                    throwException('Network config not defined')
                }

                const web3 = new Web3(network.rpcUrl)

                const [rate, gasPrice = '0', gasUsage] = await Promise.all([
                    getPrice(this.rightNetwork.currencySymbol.toLowerCase()),
                    web3.eth.getGasPrice(),
                    this.getGasUsage(),
                ])

                const gasPriceNumber = BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.tvmWallet.coin.decimals)

                attachedAmount = gasPriceNumber.plus(eventInitialBalance)
            }

            const eventCloser = EventClosers[Math.floor(Math.random() * EventClosers.length)]
            const remainingGasTo = this.isSwapEnabled ? eventCloser : this.tvmWallet.account.address

            await walletContract.methods
                .transfer({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    deployWalletValue: '200000000',
                    notify: true,
                    payload: data.boc,
                    recipient: this.pipeline.proxyAddress,
                    remainingGasTo,
                })
                .send({
                    amount: attachedAmount.toFixed(),
                    bounce: true,
                    from: new Address(this.leftAddress),
                })

            const eventAddress = await eventStream

            //  Todo move to another place
            if (this.token !== undefined && this.pipeline.evmTokenAddress !== undefined) {
                try {
                    const { chainId, type, rpcUrl } = this.rightNetwork

                    const { evmTokenAddress } = this.pipeline
                    const key = `${type}-${chainId}-${evmTokenAddress}`.toLowerCase()

                    let decimals,
                        name,
                        symbol

                    try {
                        [decimals, name, symbol] = await Promise.all([
                            erc20TokenContract(evmTokenAddress, rpcUrl).methods.decimals().call(),
                            erc20TokenContract(evmTokenAddress, rpcUrl).methods.name().call(),
                            erc20TokenContract(evmTokenAddress, rpcUrl).methods.symbol().call(),
                        ])
                    }
                    catch (e) {
                        ({ decimals, name, symbol } = this.token)
                    }

                    const asset = {
                        chainId,
                        decimals,
                        key,
                        name,
                        root: evmTokenAddress,
                        symbol,
                    }

                    this.bridgeAssets.add(new EvmToken({ ...asset, logoURI: this.token.icon }))

                    const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

                    importedAssets[key] = { ...asset, icon: this.token.icon }

                    storage.set('imported_assets', JSON.stringify(importedAssets))
                }
                catch (e) {}
            }

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Transfer TVM Native Token error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     * Transfer sum of the TVM Native currency and Wrapped Currency Token to the EVM
     *
     * - EVER + WEVER
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async transferTvmNativeCombination(reject?: (e: any) => void): Promise<void> {
        if (
            this.tvmWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.tvmWallet.account?.address === undefined
        ) {
            return
        }

        const subscriber = new staticRpc.Subscriber()

        try {
            this.setState('isProcessing', true)

            const walletContract = tokenWalletContract((this.token as EverscaleToken).wallet as Address)
            const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)

            const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
            const startLt = everscaleConfigState?.lastTransactionId?.lt

            const eventStream = subscriber
                .transactions(everscaleConfigContract.address)
                .flatMap(item => item.transactions)
                .filter(tx => !startLt || tx.id.lt > startLt)
                .filterMap(async tx => {
                    const decodedTx = await everscaleConfigContract.decodeTransaction({
                        methods: ['deployEvent'],
                        transaction: tx,
                    })

                    if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                        const { eventData } = decodedTx.input.eventVoteData
                        const event = await staticRpc.unpackFromCell({
                            allowPartial: true,
                            boc: eventData,
                            structure: [
                                { name: 'nonce', type: 'uint32' },
                                { name: 'proxy', type: 'address' },
                                { name: 'tokenWallet', type: 'address' },
                                { name: 'token', type: 'address' },
                                { name: 'remainingGasTo', type: 'address' },
                                { name: 'amount', type: 'uint128' },
                                { name: 'recipient', type: 'uint160' },
                                { name: 'chainId', type: 'uint256' },
                            ] as const,
                        })
                        const checkEvmAddress = `0x${BigNumber(event.data.recipient)
                        .toString(16)
                        .padStart(40, '0')}`

                        if (
                            [
                                ...eventClosers,
                                Compounder.toString().toLowerCase(),
                                this.leftAddress!.toLowerCase(),
                            ].includes(event.data.remainingGasTo.toString().toLowerCase())
                            && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                        ) {
                            const eventAddress = await everscaleConfigContract.methods
                            .deriveEventAddress({
                                answerId: 0,
                                eventVoteData: decodedTx.input.eventVoteData,
                            })
                            .call()

                            return eventAddress.eventContract
                        }
                        return undefined
                    }
                    return undefined
                })
                .first()

            /* eslint-disable sort-keys */
            const transferPayload = await staticRpc.packIntoCell({
                data: {
                    addr: this.rightAddress,
                    chainId: this.rightNetwork.chainId,
                    callback: {
                        recipient: '0x0000000000000000000000000000000000000000',
                        payload: '',
                        strict: false,
                    },
                },
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
                        name: 'callback',
                        type: 'tuple',
                    },
                ] as const,
            })

            const data = await staticRpc.packIntoCell({
                data: {
                    nonce: getRandomUint(),
                    network: 1,
                    transferPayload: transferPayload.boc,
                },
                structure: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'network', type: 'uint8' },
                    { name: 'transferPayload', type: 'cell' },
                ] as const,
            })

            const eventCloser = EventClosers[Math.floor(Math.random() * EventClosers.length)]
            const remainingGasTo = this.isSwapEnabled ? eventCloser : this.tvmWallet.account.address

            const compounderPayload = await staticRpc.packIntoCell({
                data: {
                    to: this.pipeline.proxyAddress,
                    amount: this.amountNumber
                    .shiftedBy(this.tvmWallet.coin.decimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed(),
                    remainingGasTo,
                    payload: data.boc,
                },
                structure: [
                    { name: 'to', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ] as const,
            })
            /* eslint-enable sort-keys */

            const eventInitialBalance = await this.getInitialBalance()

            let attachedAmount = BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const network = findNetwork(this.pipeline.chainId, 'evm')

                if (network === undefined) {
                    throwException('Network config not defined')
                }

                const web3 = new Web3(network.rpcUrl)

                const [rate, gasPrice = '0', gasUsage] = await Promise.all([
                    getPrice(this.rightNetwork.currencySymbol.toLowerCase()),
                    web3.eth.getGasPrice(),
                    this.getGasUsage(),
                ])

                const gasPriceNumber = BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.tvmWallet.coin.decimals)

                attachedAmount = gasPriceNumber.plus(eventInitialBalance)
            }

            const delta = this.amountNumber
                .shiftedBy(this.tvmWallet.coin.decimals)
                .minus(this.token.balance ?? this.pipeline.everscaleTokenBalance ?? 0)
                .toFixed()

            await walletContract
                .methods.transfer({
                    amount: this.token.balance ?? '0',
                    deployWalletValue: '200000000',
                    notify: true,
                    payload: compounderPayload.boc,
                    recipient: Compounder,
                    remainingGasTo,
                })
                .send({
                    amount: attachedAmount.plus(delta).toFixed(),
                    bounce: true,
                    from: new Address(this.leftAddress),
                })

            const eventAddress = await eventStream

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Transfer TVM Native Combination error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     * Wrap TVM Native currency and transfer to the EVM
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async wrapTvmNativeCurrency(reject?: (e: any) => void): Promise<void> {
        if (
            this.tvmWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.tvmWallet.account?.address === undefined
        ) {
            return
        }

        const subscriber = new staticRpc.Subscriber()

        try {
            this.setState('isProcessing', true)

            const WEVERVault = wrappedCoinVaultContract(WEVERVaultAddress)
            const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)

            const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
            const startLt = everscaleConfigState?.lastTransactionId?.lt

            const eventStream = subscriber
                .transactions(everscaleConfigContract.address)
                .flatMap(item => item.transactions)
                .filter(tx => !startLt || tx.id.lt > startLt)
                .filterMap(async tx => {
                    const decodedTx = await everscaleConfigContract.decodeTransaction({
                        methods: ['deployEvent'],
                        transaction: tx,
                    })

                    if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                        const { eventData } = decodedTx.input.eventVoteData
                        const event = await staticRpc.unpackFromCell({
                            allowPartial: true,
                            boc: eventData,
                            structure: [
                                { name: 'nonce', type: 'uint32' },
                                { name: 'proxy', type: 'address' },
                                { name: 'tokenWallet', type: 'address' },
                                { name: 'token', type: 'address' },
                                { name: 'remainingGasTo', type: 'address' },
                                { name: 'amount', type: 'uint128' },
                                { name: 'recipient', type: 'uint160' },
                                { name: 'chainId', type: 'uint256' },
                            ] as const,
                        })
                        const checkEvmAddress = `0x${BigNumber(event.data.recipient)
                        .toString(16)
                        .padStart(40, '0')}`

                        if (
                            [
                                ...eventClosers,
                                Compounder.toString().toLowerCase(),
                                this.leftAddress!.toLowerCase(),
                            ].includes(event.data.remainingGasTo.toString().toLowerCase())
                            && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                        ) {
                            const eventAddress = await everscaleConfigContract.methods
                            .deriveEventAddress({
                                answerId: 0,
                                eventVoteData: decodedTx.input.eventVoteData,
                            })
                            .call()

                            return eventAddress.eventContract
                        }
                        return undefined
                    }
                    return undefined
                })
                .first()

            /* eslint-disable sort-keys */
            const transferPayload = await staticRpc.packIntoCell({
                data: {
                    addr: this.rightAddress,
                    chainId: this.rightNetwork.chainId,
                    callback: {
                        recipient: '0x0000000000000000000000000000000000000000',
                        payload: '',
                        strict: false,
                    },
                },
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
                        name: 'callback',
                        type: 'tuple',
                    },
                ] as const,
            })

            const data = await staticRpc.packIntoCell({
                data: {
                    nonce: getRandomUint(),
                    network: 1,
                    transferPayload: transferPayload.boc,
                },
                structure: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'network', type: 'uint8' },
                    { name: 'transferPayload', type: 'cell' },
                ] as const,
            })

            const eventCloser = EventClosers[Math.floor(Math.random() * EventClosers.length)]
            const remainingGasTo = this.isSwapEnabled ? eventCloser : this.tvmWallet.account.address

            const compounderPayload = await staticRpc.packIntoCell({
                data: {
                    to: this.pipeline.proxyAddress,
                    amount: this.amountNumber.shiftedBy(this.tvmWallet.coin.decimals).toFixed(),
                    remainingGasTo,
                    payload: data.boc,
                },
                structure: [
                    { name: 'to', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ] as const,
            })
            /* eslint-enable sort-keys */

            const eventInitialBalance = await this.getInitialBalance()

            let value = this.amountNumber
                .shiftedBy(this.tvmWallet.coin.decimals)
                .plus(eventInitialBalance)

            if (this.isSwapEnabled) {
                const network = findNetwork(this.pipeline.chainId, 'evm')

                if (network === undefined) {
                    throwException('Network config not defined')
                }

                const web3 = new Web3(network.rpcUrl)

                const [rate, gasPrice = '0', gasUsage] = await Promise.all([
                    getPrice(this.rightNetwork.currencySymbol.toLowerCase()),
                    web3.eth.getGasPrice(),
                    this.getGasUsage(),
                ])

                const gasPriceNumber = BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.tvmWallet.coin.decimals)

                value = this.amountNumber
                    .shiftedBy(this.tvmWallet.coin.decimals)
                    .plus(gasPriceNumber.plus(eventInitialBalance))
                    .dp(0, BigNumber.ROUND_UP)
            }

            await WEVERVault.methods
                .wrap({
                    tokens: this.amountNumber.shiftedBy(this.tvmWallet.coin.decimals).toFixed(),
                    // eslint-disable-next-line sort-keys
                    owner_address: Compounder,
                    // eslint-disable-next-line sort-keys
                    gas_back_address: remainingGasTo,
                    payload: compounderPayload.boc,
                })
                .send({
                    amount: value.plus(500_000_000).toFixed(),
                    bounce: true,
                    from: new Address(this.leftAddress),
                })

            const eventAddress = await eventStream

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Wrap TVM Native Currency error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     * Burn TVM-alien token and unlock it in EVM
     *
     * - through MergePool
     * - through AlienProxy (EVM Wrapped Native currency)
     * - through AlienProxy (common tokens)
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async burnTvmAlienToken(reject?: (e: any) => void): Promise<void> {
        if (
            this.tvmWallet.account?.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || (this.token as EverscaleToken)?.wallet === undefined
            || this.pipeline?.everscaleConfiguration === undefined
        ) {
            return
        }

        const subscriber = new staticRpc.Subscriber()

        try {
            this.setState('isProcessing', true)

            const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)
            const walletContract = tokenWalletContract((this.token as EverscaleToken)?.wallet as Address)

            const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
            const startLt = everscaleConfigState?.lastTransactionId?.lt

            const eventStream = subscriber
                .transactions(everscaleConfigContract.address)
                .flatMap(item => item.transactions)
                .filter(tx => !startLt || tx.id.lt > startLt)
                .filterMap(async tx => {
                    const decodedTx = await everscaleConfigContract.decodeTransaction({
                        methods: ['deployEvent'],
                        transaction: tx,
                    })

                    if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                        const { eventData } = decodedTx.input.eventVoteData
                        const event = await staticRpc.unpackFromCell({
                            allowPartial: true,
                            boc: eventData,
                            structure: [
                                { name: 'nonce', type: 'uint32' },
                                { name: 'proxy', type: 'address' },
                                { name: 'token', type: 'address' },
                                { name: 'remainingGasTo', type: 'address' },
                                { name: 'amount', type: 'uint128' },
                                { name: 'recipient', type: 'uint160' },
                                { name: 'callback_recipient', type: 'uint160' },
                                { name: 'callback_payload', type: 'bytes' },
                                { name: 'callback_strict', type: 'bool' },
                            ] as const,
                        })

                        const checkEvmAddress = `0x${BigNumber(event.data.recipient)
                            .toString(16)
                            .padStart(40, '0')}`

                        const addr = `0x${BigNumber(
                            `0x${Buffer.from(event.data.callback_payload, 'base64').toString('hex')}`,
                        ).toString(16)}`

                        if (
                            [...eventClosers, this.leftAddress!.toLowerCase()].includes(
                                event.data.remainingGasTo.toString().toLowerCase(),
                            )
                            && (checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                                || addr.toLowerCase() === this.rightAddress.toLowerCase())
                        ) {
                            const eventAddress = await everscaleConfigContract.methods
                            .deriveEventAddress({
                                answerId: 0,
                                eventVoteData: decodedTx.input.eventVoteData,
                            })
                            .call()

                            return eventAddress.eventContract
                        }
                        return undefined
                    }
                    return undefined
                })
                .first()

            const eventInitialBalance = await this.getInitialBalance()

            let attachedAmount = BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const network = findNetwork(this.pipeline.chainId, 'evm')

                if (network === undefined) {
                    throwException('Network config not defined')
                }

                const web3 = new Web3(network.rpcUrl)
                const gasUsage = 600_000

                const [rate, gasPrice = '0'] = await Promise.all([
                    getPrice(this.rightNetwork.currencySymbol.toLowerCase()),
                    web3.eth.getGasPrice(),
                ])

                const gasPriceNumber = BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.tvmWallet.coin.decimals)

                attachedAmount = gasPriceNumber.plus(eventInitialBalance)
            }

            const eventCloser = EventClosers[Math.floor(Math.random() * EventClosers.length)]
            const remainingGasTo = this.isSwapEnabled ? eventCloser : this.tvmWallet.account.address

            const { mergePoolAddress, mergeEverscaleTokenAddress } = this.pipeline

            if (mergePoolAddress !== undefined && mergeEverscaleTokenAddress !== undefined) {
                /* eslint-disable sort-keys */
                const operationPayload = await staticRpc.packIntoCell({
                    data: {
                        addr: this.rightAddress,
                        callback: {
                            recipient: '0x0000000000000000000000000000000000000000',
                            payload: '',
                            strict: false,
                        },
                    },
                    structure: [
                        { name: 'addr', type: 'uint160' },
                        {
                            components: [
                                { name: 'recipient', type: 'uint160' },
                                { name: 'payload', type: 'cell' },
                                { name: 'strict', type: 'bool' },
                            ] as const,
                            name: 'callback',
                            type: 'tuple',
                        },
                    ] as const,
                })

                const payload = await staticRpc.packIntoCell({
                    data: {
                        network: 1,
                        withdrawPayload: operationPayload.boc,
                    },
                    structure: [
                        { name: 'network', type: 'uint8' },
                        { name: 'withdrawPayload', type: 'cell' },
                    ] as const,
                })

                const data = await staticRpc.packIntoCell({
                    data: {
                        nonce: getRandomUint(),
                        burnType: BurnType.Withdraw,
                        targetToken: mergeEverscaleTokenAddress,
                        operationPayload: payload.boc,
                    },
                    structure: [
                        { name: 'nonce', type: 'uint32' },
                        { name: 'burnType', type: 'uint8' },
                        { name: 'targetToken', type: 'address' },
                        { name: 'operationPayload', type: 'cell' },
                    ] as const,
                })
                /* eslint-enable sort-keys */

                await walletContract.methods
                .burn({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    callbackTo: mergePoolAddress,
                    payload: data.boc,
                    remainingGasTo,
                })
                .send({
                    amount: attachedAmount.toFixed(),
                    bounce: true,
                    from: new Address(this.leftAddress),
                })
            }
            else if (this.token.root && this.bridgeAssets.isNativeCurrency(this.token.root)) {
                /* eslint-disable sort-keys */
                const burnPayload = await staticRpc.packIntoCell({
                    data: {
                        addr: Unwrapper,
                        callback: {
                            recipient: Unwrapper,
                            payload:
                                this.evmWallet.web3?.eth.abi.encodeParameters(['address'], [this.rightAddress]) ?? '',
                            strict: false,
                        },
                    },
                    structure: [
                        { name: 'addr', type: 'uint160' },
                        {
                            components: [
                                { name: 'recipient', type: 'uint160' },
                                { name: 'payload', type: 'bytes' },
                                { name: 'strict', type: 'bool' },
                            ] as const,
                            name: 'callback',
                            type: 'tuple',
                        },
                    ] as const,
                })

                const data = await staticRpc.packIntoCell({
                    data: {
                        nonce: getRandomUint(),
                        network: 1,
                        burnPayload: burnPayload.boc,
                    },
                    structure: [
                        { name: 'nonce', type: 'uint32' },
                        { name: 'network', type: 'uint8' },
                        { name: 'burnPayload', type: 'cell' },
                    ] as const,
                })
                /* eslint-enable sort-keys */

                await walletContract.methods
                .burn({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    callbackTo: this.pipeline.proxyAddress,
                    payload: data.boc,
                    remainingGasTo,
                })
                .send({
                    amount: attachedAmount.toFixed(),
                    bounce: true,
                    from: new Address(this.leftAddress),
                })
            }
            else {
                /* eslint-disable sort-keys */
                const burnPayload = await staticRpc.packIntoCell({
                    data: {
                        addr: this.rightAddress,
                        callback: {
                            recipient: '0x0000000000000000000000000000000000000000',
                            payload: '',
                            strict: false,
                        },
                    },
                    structure: [
                        { name: 'addr', type: 'uint160' },
                        {
                            components: [
                                { name: 'recipient', type: 'uint160' },
                                { name: 'payload', type: 'cell' },
                                { name: 'strict', type: 'bool' },
                            ] as const,
                            name: 'callback',
                            type: 'tuple',
                        },
                    ] as const,
                })

                const data = await staticRpc.packIntoCell({
                    data: {
                        nonce: getRandomUint(),
                        network: 1,
                        burnPayload: burnPayload.boc,
                    },
                    structure: [
                        { name: 'nonce', type: 'uint32' },
                        { name: 'network', type: 'uint8' },
                        { name: 'burnPayload', type: 'cell' },
                    ] as const,
                })
                /* eslint-enable sort-keys */

                await walletContract.methods
                .burn({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    callbackTo: this.pipeline.proxyAddress,
                    payload: data.boc,
                    remainingGasTo,
                })
                .send({
                    amount: attachedAmount.toFixed(),
                    bounce: true,
                    from: new Address(this.leftAddress),
                })
            }

            const eventAddress = await eventStream

            // todo move it to another place
            if (this.token !== undefined && this.pipeline.evmTokenAddress !== undefined) {
                try {
                    const { chainId, type, rpcUrl } = this.rightNetwork

                    const { evmTokenAddress } = this.pipeline
                    const key = `${type}-${chainId}-${evmTokenAddress}`.toLowerCase()

                    let decimals,
                        name,
                        symbol

                    try {
                        [decimals, name, symbol] = await Promise.all([
                            erc20TokenContract(evmTokenAddress, rpcUrl).methods.decimals().call(),
                            erc20TokenContract(evmTokenAddress, rpcUrl).methods.name().call(),
                            erc20TokenContract(evmTokenAddress, rpcUrl).methods.symbol().call(),
                        ])
                    }
                    catch (e) {
                        ({ decimals, name, symbol } = this.token)
                    }

                    const asset = {
                        chainId,
                        decimals,
                        key,
                        name,
                        root: evmTokenAddress,
                        symbol,
                    }

                    this.bridgeAssets.add(new EvmToken({ ...asset, logoURI: this.token.icon }))

                    const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

                    importedAssets[key] = { ...asset, icon: this.token.icon }

                    storage.set('imported_assets', JSON.stringify(importedAssets))
                }
                catch (e) {}
            }

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Burn TVM ALien Token error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     * **EVM => EVM**
     *
     * Prepare first transfer - from EVM to EVM -
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async prepareTransit(reject?: (e: any) => void): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
                || this.secondPipeline?.proxyAddress === undefined
                || this.rightNetwork?.chainId === undefined
            ) {
                return
            }

            const network = findNetwork(this.pipeline.chainId, 'evm')

            if (network === undefined) {
                return
            }

            this.setState('isProcessing', true)

            try {
                attempts += 1

                const target = Mediator.toString().split(':')

                const vaultContract = new this.evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress.toString(),
                )

                const eventInitialBalance = await this.getInitialBalance()

                const amount = this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed()

                let payload: string | undefined

                /* eslint-disable sort-keys */
                const { mergePoolAddress, mergeEverscaleTokenAddress } = this.secondPipeline

                /** TransitOperation.BurnToMergePool */
                if (mergePoolAddress && mergeEverscaleTokenAddress) {
                    const callbackPayload = await staticRpc.packIntoCell({
                        data: {
                            addr: this.rightAddress,
                            callback: {
                                recipient: '0x0000000000000000000000000000000000000000',
                                payload: '',
                                strict: false,
                            },
                        },
                        structure: [
                            { name: 'addr', type: 'uint160' },
                            {
                                components: [
                                    { name: 'recipient', type: 'uint160' },
                                    { name: 'payload', type: 'cell' },
                                    { name: 'strict', type: 'bool' },
                                ] as const,
                                name: 'callback',
                                type: 'tuple',
                            },
                        ] as const,
                    })

                    const operationPayload = await staticRpc.packIntoCell({
                        data: {
                            network: 1,
                            payload: callbackPayload.boc,
                        },
                        structure: [
                            { name: 'network', type: 'uint8' },
                            { name: 'payload', type: 'cell' },
                        ] as const,
                    })

                    const burnPayload = await staticRpc.packIntoCell({
                        data: {
                            nonce: getRandomUint(),
                            burnType: BurnType.Withdraw,
                            targetToken: mergeEverscaleTokenAddress,
                            operationPayload: operationPayload.boc,
                        },
                        structure: [
                            { name: 'nonce', type: 'uint32' },
                            { name: 'burnType', type: 'uint8' },
                            { name: 'targetToken', type: 'address' },
                            { name: 'operationPayload', type: 'cell' },
                        ] as const,
                    })

                    const data = await staticRpc.packIntoCell({
                        data: {
                            operation: TransitOperation.BurnToMergePool,
                            recipient: mergePoolAddress,
                            payload: burnPayload.boc,
                        },
                        structure: [
                            { name: 'operation', type: 'uint8' },
                            { name: 'recipient', type: 'address' },
                            { name: 'payload', type: 'cell' },
                        ] as const,
                    })

                    payload = Buffer.from(data.boc, 'base64').toString('hex')
                }
                else if (this.secondPipeline.isNative === true) {
                    /** TransitOperation.TransferToNativeProxy */
                    const transferPayload = await staticRpc.packIntoCell({
                        data: {
                            addr: this.rightAddress,
                            chainId: this.rightNetwork.chainId,
                            callback: {
                                recipient: '0x0000000000000000000000000000000000000000',
                                payload: '',
                                strict: false,
                            },
                        },
                        structure: [
                            { name: 'addr', type: 'uint160' },
                            { name: 'chainId', type: 'uint256' },
                            {
                                components: [
                                    { name: 'recipient', type: 'uint160' },
                                    { name: 'payload', type: 'cell' },
                                    { name: 'strict', type: 'bool' },
                                ] as const,
                                name: 'callback',
                                type: 'tuple',
                            },
                        ] as const,
                    })

                    const operationPayload = await staticRpc.packIntoCell({
                        data: {
                            nonce: getRandomUint(),
                            network: 1,
                            payload: transferPayload.boc,
                        },
                        structure: [
                            { name: 'nonce', type: 'uint32' },
                            { name: 'network', type: 'uint8' },
                            { name: 'payload', type: 'cell' },
                        ] as const,
                    })

                    const data = await staticRpc.packIntoCell({
                        data: {
                            operation: TransitOperation.TransferToNativeProxy,
                            recipient: this.secondPipeline.proxyAddress,
                            operationPayload: operationPayload.boc,
                        },
                        structure: [
                            { name: 'operation', type: 'uint8' },
                            { name: 'recipient', type: 'address' },
                            { name: 'operationPayload', type: 'cell' },
                        ] as const,
                    })

                    payload = Buffer.from(data.boc, 'base64').toString('hex')
                }
                else {
                    /** TransitOperation.BurnToAlienProxy */
                    const burnPayload = await staticRpc.packIntoCell({
                        data: {
                            addr: Unwrapper,
                            callback: {
                                recipient: Unwrapper,
                                payload: this.evmWallet.web3?.eth.abi.encodeParameters(
                                    ['address'],
                                    [this.rightAddress],
                                ) ?? '',
                                strict: false,
                            },
                        },
                        structure: [
                            { name: 'addr', type: 'uint160' },
                            {
                                components: [
                                    { name: 'recipient', type: 'uint160' },
                                    { name: 'payload', type: 'bytes' },
                                    { name: 'strict', type: 'bool' },
                                ] as const,
                                name: 'callback',
                                type: 'tuple',
                            },
                        ] as const,
                    })

                    const operationPayload = await staticRpc.packIntoCell({
                        data: {
                            nonce: getRandomUint(),
                            network: 1,
                            payload: burnPayload.boc,
                        },
                        structure: [
                            { name: 'nonce', type: 'uint32' },
                            { name: 'network', type: 'uint8' },
                            { name: 'payload', type: 'cell' },
                        ] as const,
                    })

                    const data = await staticRpc.packIntoCell({
                        data: {
                            operation: TransitOperation.BurnToAlienProxy,
                            recipient: this.secondPipeline.proxyAddress,
                            payload: operationPayload.boc,
                        },
                        structure: [
                            { name: 'operation', type: 'uint8' },
                            { name: 'recipient', type: 'address' },
                            { name: 'payload', type: 'cell' },
                        ] as const,
                    })

                    payload = Buffer.from(data.boc, 'base64').toString('hex')
                }
                /* eslint-enable sort-keys */

                let value = this.amountNumber.shiftedBy(this.evmWallet.coin.decimals),
                    expectedEvers = BigNumber(eventInitialBalance)

                try {
                    if (this.pipeline.everscaleTokenAddress) {
                        const state = await getFullContractState(this.pipeline.everscaleTokenAddress)
                        if (!state?.isDeployed) {
                            debug('Token not deployed: + 1 expected evers')
                            expectedEvers = expectedEvers.plus(1_000_000_000)
                        }
                    }
                    else {
                        debug('Token not deployed: + 1 expected evers')
                        expectedEvers = expectedEvers.plus(1_000_000_000)
                    }
                }
                catch (e) {
                    debug('Token not deployed: + 1 expected evers')
                    expectedEvers = expectedEvers.plus(1_000_000_000)
                }

                const rate = await getPrice(this.leftNetwork?.currencySymbol.toLowerCase() as string)

                if (this.isNativeEvmCurrency) {
                    value = value.plus(
                        expectedEvers
                        .shiftedBy(-this.tvmWallet.coin.decimals)
                        .div(rate)
                        .times(1.2)
                        .shiftedBy(this.evmWallet.coin.decimals)
                        .dp(0, BigNumber.ROUND_DOWN),
                    )
                }
                else {
                    value = expectedEvers
                        .shiftedBy(-this.tvmWallet.coin.decimals)
                        .div(rate)
                        .times(1.2)
                        .shiftedBy(this.evmWallet.coin.decimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                }

                const targetNetwork = findNetwork(this.secondPipeline.chainId, 'evm')

                // if token exists in evm
                if (targetNetwork) {
                    const gasUsage = await this.getSecondGasUsage()

                    const web3 = new Web3(targetNetwork.rpcUrl)
                    const targetGasPrice = await web3.eth.getGasPrice()
                    const targetRate = await getPrice(this.rightNetwork?.currencySymbol.toLowerCase() as string)

                    const gasPriceNumber = BigNumber(targetGasPrice || 0)
                        .times(gasUsage)
                        .shiftedBy(-this.evmWallet.coin.decimals)
                        .times(targetRate)
                        .times(1.2)
                        .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)

                    expectedEvers = expectedEvers.plus(
                        gasPriceNumber
                            .shiftedBy(this.tvmWallet.coin.decimals)
                            .dp(0, BigNumber.ROUND_DOWN),
                    )

                    value = value.plus(
                        gasPriceNumber
                            .div(rate)
                            .shiftedBy(this.evmWallet.coin.decimals)
                            .dp(0, BigNumber.ROUND_DOWN),
                    )
                }

                let r: any

                if (this.isNativeEvmCurrency) {
                    r = vaultContract.methods.depositByNativeToken([
                        /* recipient */ [target[0], `0x${target[1]}`],
                        /* amount */ amount,
                        /* expected_evers */ expectedEvers.toFixed(),
                        /* payload */ payload === undefined ? [] : `0x${payload}`,
                    ])
                }
                else {
                    r = vaultContract.methods.deposit([
                        /* recipient */ [target[0], `0x${target[1]}`],
                        /* token */ this.pipeline.evmTokenAddress,
                        /* amount */ amount,
                        /* expected_evers */ expectedEvers.toFixed(),
                        /* payload */ payload === undefined ? [] : `0x${payload}`,
                    ])
                }

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                        value: value.toFixed(),
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        gas,
                        type: transactionType,
                        value: value.toFixed(),
                    })
                    .once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined
                    && transactionType !== '0x0'
                ) {
                    error('Prepare transit error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Prepare transit error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async prepareTvmToSolana(reject?: (e: any) => void): Promise<void> {
        if (
            this.tvmWallet.account?.address === undefined
            || this.solanaWallet.publicKey == null
            || this.solanaWallet.connection === undefined
            || this.rightNetwork?.chainId === undefined
            || (this.token as EverscaleToken) === undefined
            || (this.token as EverscaleToken)?.wallet === undefined
            || this.token?.decimals === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.pipeline.settings === undefined
            || this.pipeline.solanaTokenAddress === undefined
        ) {
            return
        }

        this.setState('isProcessing', true)

        const subscriber = new staticRpc.Subscriber()

        try {
            const everscaleConfigContract = everSolEventConfigurationContract(this.pipeline.everscaleConfiguration)

            const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)

            const startLt = everscaleConfigState?.lastTransactionId?.lt

            const eventStream = await subscriber
            .transactions(everscaleConfigContract.address)
            .flatMap(item => item.transactions)
            .filter(tx => !startLt || tx.id.lt > startLt)
            .filterMap(async tx => {
                const decodedTx = await everscaleConfigContract.decodeTransaction({
                    methods: ['deployEvent'],
                    transaction: tx,
                })

                if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                    const { eventData } = decodedTx.input.eventVoteData
                    const event = await staticRpc.unpackFromCell({
                        allowPartial: true,
                        boc: eventData,
                        structure: [
                            { name: 'senderAddress', type: 'address' },
                            { name: 'tokens', type: 'uint128' },
                            { name: 'solanaOwnerAddress', type: 'uint256' },
                        ] as const,
                    })

                    const targetAddress = bs58.encode(
                        Buffer.from(BigNumber(event.data.solanaOwnerAddress).toString(16), 'hex'),
                    )

                    if (
                        event.data.senderAddress.toString().toLowerCase() === this.leftAddress.toLowerCase()
                        && targetAddress.toLowerCase() === this.rightAddress.toLowerCase()
                    ) {
                        const eventAddress = await everscaleConfigContract.methods
                        .deriveEventAddress({
                            answerId: 0,
                            eventVoteData: decodedTx.input.eventVoteData,
                        })
                        .call()

                        return eventAddress.eventContract
                    }
                    return undefined
                }
                return undefined
            })
            .delayed(s => s.first())

            await initBridge()

            const rightAddressKey = new PublicKey(this.rightAddress)

            let account = (
                await this.solanaWallet.connection.getParsedTokenAccountsByOwner(rightAddressKey, {
                    programId: TOKEN_PROGRAM_ID,
                })
            ).value
            .filter(item => this.pipeline?.solanaTokenAddress?.equals(
                new PublicKey(item.account.data.parsed.info.mint),
            ))
            .sort(
                (a, b) => a.account.data.parsed.info.tokenAmount.uiAmount
                    - b.account.data.parsed.info.tokenAmount.uiAmount,
            )
            .pop()?.pubkey

            if (account === undefined) {
                account = await findAssociatedTokenAddress(rightAddressKey, this.pipeline.solanaTokenAddress)
            }

            const vaultAddress = this.pipeline.vaultAddress as PublicKey

            const executeAccounts = [
                // vault
                {
                    account: `0x${Buffer.from(vaultAddress.toBuffer()).toString('hex')}`,
                    isSigner: false,
                    readOnly: false,
                },
                // recipient token
                {
                    account: `0x${Buffer.from(account.toBuffer()).toString('hex')}`,
                    isSigner: false,
                    readOnly: false,
                },
                // token settings
                {
                    account: `0x${Buffer.from(this.pipeline.settings.toBuffer()).toString('hex')}`,
                    isSigner: false,
                    readOnly: false,
                },
                // settings
                {
                    account: '0x0d0a20d411e5eea9effa1cef17b0cce7091f81be20ad884f1a9bcbd81938e4f4',
                    isSigner: false,
                    readOnly: true,
                },
                // token program
                {
                    account: '0x06ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9',
                    isSigner: false,
                    readOnly: true,
                },
                // clock
                {
                    account: '0x06a7d51718c774c928566398691d5eb68b5eb8a39b4b6d5c73555b2100000000',
                    isSigner: false,
                    readOnly: true,
                },
            ]

            /* eslint-disable sort-keys */
            const burnPayload = await staticRpc.packIntoCell({
                data: {
                    solanaOwnerAddress: `0x${Buffer.from(rightAddressKey.toBuffer()).toString('hex')}`,
                    executeAccounts,
                },
                structure: [
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                    {
                        components: [
                            { name: 'account', type: 'uint256' },
                            { name: 'readOnly', type: 'bool' },
                            { name: 'isSigner', type: 'bool' },
                        ] as const,
                        name: 'executeAccounts',
                        type: 'tuple[]',
                    },
                ] as const,
            })

            const data = await staticRpc.packIntoCell({
                data: {
                    type: 1,
                    burnPayload: burnPayload.boc,
                },
                structure: [
                    { name: 'type', type: 'uint8' },
                    { name: 'burnPayload', type: 'cell' },
                ] as const,
            })
            /* eslint-enable sort-keys */

            await tokenWalletContract((this.token as EverscaleToken).wallet as Address)
            .methods.burn({
                amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                callbackTo: this.pipeline.proxyAddress,
                payload: data.boc,
                remainingGasTo: this.tvmWallet.account.address,
            })
            .send({
                amount: '6000000000',
                bounce: true,
                from: new Address(this.leftAddress),
            })

            const eventAddress = await eventStream()

            this.setData('txHash', eventAddress?.toString())
        }
        catch (e) {
            reject?.(e)
            error('Prepare Everscale to Solana error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async depositSolana(reject?: (e: any) => void): Promise<void> {
        if (
            this.solanaWallet.publicKey == null
            || this.solanaWallet.connection === undefined
            || this.pipeline?.name === undefined
            || this.pipeline.solanaTokenAddress === undefined
            || this.pipeline.solanaTokenDecimals === undefined
        ) {
            return
        }

        this.setState('isProcessing', true)

        try {
            const account = (
                await this.solanaWallet.connection.getParsedTokenAccountsByOwner(this.solanaWallet.publicKey, {
                    programId: TOKEN_PROGRAM_ID,
                })
            ).value
            .filter(item => this.pipeline?.solanaTokenAddress?.equals(
                new PublicKey(item.account.data.parsed.info.mint),
            ))
            .sort(
                (a, b) => a.account.data.parsed.info.tokenAmount.uiAmount
                    - b.account.data.parsed.info.tokenAmount.uiAmount,
            )
            .pop()

            if (account === undefined) {
                throwException('Cant find token account by owner')
                return
            }

            await initBridge()

            const instruction = depositSol(
                this.solanaWallet.publicKey.toBase58(),
                this.solanaWallet.publicKey.toBase58(),
                this.pipeline.solanaTokenAddress.toBase58(),
                account.pubkey.toBase58(),
                this.pipeline.name,
                uuid.v4(),
                this.rightAddress,
                BigInt(this.amountNumber.shiftedBy(this.pipeline.solanaTokenDecimals).toFixed()),
            )

            const transaction = new Transaction().add(ixFromRust(instruction))
            const signature = await this.solanaWallet.adapter.sendTransaction(
                transaction,
                this.solanaWallet.connection,
            )

            const latestBlockHash = await this.solanaWallet.connection.getLatestBlockhash()

            await this.solanaWallet.connection.confirmTransaction(
                {
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature,
                },
                'processed',
            )

            this.setData('txHash', signature)
        }
        catch (e) {
            reject?.(e)
            error('Deposit Solana error', e)
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /*
     * Computed pipeline directions states
     * ----------------------------------------------------------------------------------
     */

    public get rightNetworks(): NetworkShape[] {
        if (this.leftNetwork?.type === 'evm') {
            return networks.filter(network => (this.rightNetwork === undefined
                ? network.id !== this.leftNetwork?.id && network.type !== 'solana'
                : true))
        }
        return networks
    }

    public get leftAddress(): CrosschainBridgeStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): CrosschainBridgeStoreData['leftNetwork'] {
        return this.data.leftNetwork
    }

    public get rightAddress(): CrosschainBridgeStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get rightNetwork(): CrosschainBridgeStoreData['rightNetwork'] {
        return this.data.rightNetwork
    }

    public get isEvmTvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'tvm'
    }

    public get isTvmEvm(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'evm'
    }

    public get isSolanaTvm(): boolean {
        return this.leftNetwork?.type === 'solana' && this.rightNetwork?.type === 'tvm'
    }

    public get isTvmSolana(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'solana'
    }

    public get isEvmEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isFromEvm(): boolean {
        return this.leftNetwork?.type === 'evm'
    }

    public get isFromTvm(): boolean {
        return this.leftNetwork?.type === 'tvm'
    }

    public get isFromSolana(): boolean {
        return this.leftNetwork?.type === 'solana'
    }

    /*
     * Assets computed values
     * ----------------------------------------------------------------------------------
     */

    public get tokens(): BridgeAsset[] {
        const leftChainId = this.leftNetwork?.chainId

        if (this.isFromEvm && leftChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => isEvmAddressValid(token.root) && token.chainId === leftChainId,
            )
        }

        if (this.isFromTvm && leftChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => isEverscaleAddressValid(token.root) && token.chainId === leftChainId,
            )
        }

        if (this.isFromSolana && leftChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => isSolanaAddressValid(token.root) && token.chainId === leftChainId,
            )
        }

        return this.bridgeAssets.tokens
    }

    public get token(): BridgeAsset | undefined {
        if (
            this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.data.selectedToken === undefined
        ) {
            return undefined
        }

        return this.bridgeAssets.get(
            this.leftNetwork.type,
            this.leftNetwork.chainId,
            this.data.selectedToken.toLowerCase(),
        )
    }

    /**
     * Returns token decimals from EVM token vault for `EVM to` direction.
     * Otherwise, Everscale token decimals
     */
    public get decimals(): number | undefined {
        if (this.isFromEvm || isEvmAddressValid(this.token?.root)) {
            if (this.isNativeEvmCurrency) {
                return this.evmWallet.coin.decimals
            }
            return this.pipeline?.evmTokenDecimals
        }
        if (this.isFromSolana || isSolanaAddressValid(this.token?.root)) {
            return this.pipeline?.solanaTokenDecimals
        }
        if (this.isFromTvm && this.isNativeTvmCurrency) {
            return this.tvmWallet.coin.decimals
        }
        return this.token?.decimals
    }

    public get evmTokenDecimals(): number | undefined {
        if (this.isFromTvm && !this.pipeline?.isNative) {
            return this.token?.decimals
        }
        return this.isEvmEvm ? this.secondPipeline?.evmTokenDecimals : this.pipeline?.evmTokenDecimals
    }

    /**
     * Returns min value of decimals between Everscale token and EVM token vault decimals
     */
    public get amountMinDecimals(): number {
        if (this.token === undefined || this.pipeline?.evmTokenDecimals === undefined) {
            return 0
        }
        return Math.min(this.token.decimals, this.pipeline.evmTokenDecimals)
    }

    /**
     * Returns token balance in EVM token vault for `EVM to` direction.
     * Otherwise, Everscale token balance
     */
    public get balance(): string | undefined {
        if (this.isFromEvm || isEvmAddressValid(this.token?.root)) {
            if (this.isNativeEvmCurrency && this.leftNetwork?.chainId === this.evmWallet.chainId) {
                return this.evmWallet.balance
            }
            return this.pipeline?.evmTokenBalance
        }
        if (this.isFromSolana || isSolanaAddressValid(this.token?.root)) {
            return this.pipeline?.solanaTokenBalance
        }
        if (this.isFromTvm && this.isNativeTvmCurrency) {
            return this.pipeline?.everscaleTokenBalance
        }
        return this.token?.balance
    }

    public get isTvmBasedToken(): boolean {
        if (this.isEvmEvm) {
            return this.secondPipeline?.tokenBase === 'tvm'
        }
        return this.pipeline?.tokenBase === 'tvm'
    }

    public get isNativeTvmCurrency(): boolean {
        if (this.data.selectedToken) {
            return [
                ...WEVEREvmRoots.map(i => i.toLowerCase()),
                WEVERRootAddress.toString().toLowerCase(),
            ].includes(this.data.selectedToken.toLowerCase())
        }
        return false
    }

    public get isNativeEvmCurrency(): boolean {
        if (!this.isNativeTvmCurrency && this.data.selectedToken) {
            return this.bridgeAssets.isNativeCurrency(this.data.selectedToken)
        }
        return false
    }

    public get isCalculating(): CrosschainBridgeStoreState['isCalculating'] {
        return this.state.isCalculating
    }

    public get isFetching(): CrosschainBridgeStoreState['isFetching'] {
        return this.state.isFetching
    }

    public get isLocked(): CrosschainBridgeStoreState['isLocked'] {
        return this.state.isLocked
    }

    /*
     * Computed summary data
     * ----------------------------------------------------------------------------------
     */

    public get maxTransferFee(): CrosschainBridgeStoreData['maxTransferFee'] {
        return this.data.maxTransferFee
    }

    public get minTransferFee(): CrosschainBridgeStoreData['minTransferFee'] {
        return this.data.minTransferFee
    }

    public get depositFee(): string {
        const decimals = this.pipeline?.evmTokenDecimals ?? this.token?.decimals ?? 0
        return this.amountNumber
        .shiftedBy(decimals)
        .times(this.pipeline?.depositFee ?? 0)
        .div(10000)
        .dp(0, BigNumber.ROUND_UP)
        .shiftedBy(-decimals)
        .toFixed()
    }

    public get withdrawFee(): string {
        const decimals = this.token?.decimals ?? this.pipeline?.evmTokenDecimals ?? 0
        return this.amountNumber
        .shiftedBy(decimals)
        .times(this.pipeline?.withdrawFee ?? 0)
        .div(10000)
        .dp(0, BigNumber.ROUND_UP)
        .shiftedBy(-decimals)
        .toFixed()
    }

    public get secondDepositFee(): string {
        const decimals = this.pipeline?.evmTokenDecimals ?? this.token?.decimals ?? 0
        return this.amountNumber
        .shiftedBy(decimals)
        .times(this.secondPipeline?.depositFee ?? 0)
        .div(10000)
        .dp(0, BigNumber.ROUND_UP)
        .shiftedBy(-decimals)
        .toFixed()
    }

    public get secondWithdrawFee(): string {
        const decimals = this.pipeline?.evmTokenDecimals ?? this.token?.decimals ?? 0
        return this.amountNumber
        .shiftedBy(decimals)
        .times(this.secondPipeline?.withdrawFee ?? 0)
        .div(10000)
        .dp(0, BigNumber.ROUND_UP)
        .shiftedBy(-decimals)
        .toFixed()
    }

    public get vaultBalance(): string | undefined {
        if (this.isEvmEvm) {
            return this.secondPipeline?.vaultBalance
        }
        return this.pipeline?.vaultBalance
    }

    public get vaultBalanceDecimals(): number | undefined {
        if (this.isEvmEvm) {
            return this.secondPipeline?.evmTokenDecimals
        }
        if (this.isTvmSolana) {
            return this.pipeline?.solanaTokenDecimals
        }
        return this.pipeline?.evmTokenDecimals
    }

    public get vaultLimitNumber(): BigNumber {
        if (this.isEvmEvm) {
            return BigNumber(this.secondPipeline?.vaultLimit || 0)
                .shiftedBy(this.secondPipeline?.evmTokenDecimals === undefined
                    ? 0
                    : -this.secondPipeline.evmTokenDecimals)
                .shiftedBy(this.amountMinDecimals)
                .dp(0, BigNumber.ROUND_DOWN)
        }
        return BigNumber(this.pipeline?.vaultLimit || 0)
            .shiftedBy(this.pipeline?.evmTokenDecimals === undefined ? 0 : -this.pipeline.evmTokenDecimals)
            .shiftedBy(this.amountMinDecimals)
            .dp(0, BigNumber.ROUND_DOWN)
    }

    /*
     * Computed amounts state values
     * ----------------------------------------------------------------------------------
     */

    public get amount(): CrosschainBridgeStoreData['amount'] {
        return this.data.amount
    }

    /**
     * Returns non-shifted amount field BigNumber instance
     */
    protected get amountNumber(): BigNumber {
        return BigNumber(this.amount || 0)
    }

    public get maxAmount(): string {
        if (this.isFromTvm && this.isNativeTvmCurrency) {
            if (!this.isEnoughTvmBalance) {
                return '0'
            }

            const value = BigNumber(this.token?.balance || 0)
                .plus(this.tvmWallet.balance || 0)
                .minus(this.isSwapEnabled ? this.minEversAmount ?? EverSafeAmount : EverSafeAmount)
                .shiftedBy(-this.tvmWallet.coin.decimals)
                .toFixed()

            return isGoodBignumber(value) ? value : '0'
        }

        if (this.isFromEvm && this.isNativeEvmCurrency && this.leftNetwork?.chainId === this.token?.chainId) {
            const value = this.evmWallet.balanceNumber.minus(this.isSwapEnabled ? this.evmTvmCost : 0).toFixed()

            return isGoodBignumber(value) ? value : '0'
        }

        const decimals = this.isFromEvm ? this.amountMinDecimals : this.decimals
        const value = BigNumber(this.balance || 0)

        if (!isGoodBignumber(value)) {
            return '0'
        }

        if (this.decimals !== undefined && decimals !== undefined) {
            return value.shiftedBy(-this.decimals).dp(decimals, BigNumber.ROUND_DOWN).toFixed()
        }

        return '0'
    }

    public get minAmount(): string {
        if (this.isEvmTvm && this.pendingWithdrawals) {
            const amount = this.pendingWithdrawals.reduce((acc, i) => acc.plus(i.amount), BigNumber(0))
            return (isGoodBignumber(amount) && this.decimals !== undefined)
                ? BigNumber(amount)
                    .shiftedBy(-this.decimals)
                    .dp(this.amountMinDecimals, BigNumber.ROUND_DOWN)
                    .toFixed()
                : '0'
        }
        return '0'
    }

    /**
     * Returns non-shifted receive EVER`s amount
     */
    public get expectedEversAmount(): CrosschainBridgeStoreData['expectedEversAmount'] {
        return this.data.expectedEversAmount
    }

    public get expectedEversAmountNumber(): BigNumber {
        return BigNumber(this.expectedEversAmount || 0)
    }

    public get gasUsage(): CrosschainBridgeStoreData['gasUsage'] {
        return this.data.gasUsage
    }

    public get maxExpectedEversAmount(): string {
        let value = this.evmWallet.balanceNumber
            .minus(this.evmTvmCost || 0)
            .times(this.data.rate || 0)
            .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)

        if (this.isNativeEvmCurrency && this.leftNetwork?.chainId === this.token?.chainId) {
            value = this.evmWallet.balanceNumber
                .minus(this.amountNumber.plus(this.evmTvmCost || 0))
                .times(this.data.rate || 0)
                .dp(this.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
        }

        return value.gte(0) ? value.toFixed() : '0'
    }

    public get minEversAmount(): string {
        return BigNumber(this.data.gasPrice || 0).plus(this.data.eventInitialBalance || 0).toFixed()
    }

    public get isAmountValid(): boolean {
        if (this.amount.length === 0) {
            return true
        }

        return (
            this.isAmountMaxValueValid
            && this.isAmountMinValueValid
            && (this.isEvmTvm ? !this.isAmountVaultLimitExceed : true)
            && (this.isFromTvm ? this.isEnoughTvmBalance : true)
        )
    }

    public get isAmountVaultLimitExceed(): boolean {
        return (
            isGoodBignumber(this.vaultLimitNumber)
            && !validateMaxValue(
                this.vaultLimitNumber.shiftedBy(-this.amountMinDecimals).toFixed(),
                this.amountNumber.toFixed(),
            )
        )
    }

    /*
     * Computed credit swap values
     * ----------------------------------------------------------------------------------
     */

    public get isSwapEnabled(): CrosschainBridgeStoreState['isSwapEnabled'] {
        return this.state.isSwapEnabled
    }

    public get tvmEvmCost(): string {
        return BigNumber(this.data.gasPrice || 0)
            .plus(this.data.eventInitialBalance || 0)
            .shiftedBy(-this.tvmWallet.coin.decimals)
            .toFixed()
    }

    public get evmTvmCost(): string {
        return BigNumber(this.data.gasPrice || 0)
            .plus(this.data.eventInitialBalance || 0)
            .shiftedBy(-this.tvmWallet.coin.decimals)
            .div(this.data.rate || 1)
            .dp(this.evmWallet.coin.decimals, BigNumber.ROUND_DOWN)
            .toFixed()
    }

    public get gasPrice(): CrosschainBridgeStoreData['gasPrice'] {
        return this.data.gasPrice
    }

    /*
     * Computed pipelines data
     * ----------------------------------------------------------------------------------
     */

    public get pipeline(): CrosschainBridgeStoreData['pipeline'] {
        return this.data.pipeline
    }

    public get secondPipeline(): CrosschainBridgeStoreData['secondPipeline'] {
        return this.data.secondPipeline
    }

    /*
     * Computed steps state values
     * ----------------------------------------------------------------------------------
     */

    public get step(): CrosschainBridgeStoreState['step'] {
        return this.state.step
    }

    public get isRouteValid(): boolean {
        const isValid = (
            this.leftNetwork !== undefined
            && this.leftAddress.length > 0
            && this.rightNetwork !== undefined
            && this.rightAddress.length > 0
            && this.bridgeAssets.isReady
        )

        if (this.isEvmEvm) {
            return (
                isValid
                && this.evmWallet.isReady
                && this.leftNetwork?.chainId === this.evmWallet.chainId
                && isEvmAddressValid(this.leftAddress)
                && isEvmAddressValid(this.rightAddress)
            )
        }

        if (this.isEvmTvm) {
            return (
                isValid
                && this.evmWallet.isReady
                && this.leftNetwork?.chainId === this.evmWallet.chainId
                && isEvmAddressValid(this.leftAddress)
                && isEverscaleAddressValid(this.rightAddress)
            )
        }

        if (this.isTvmEvm) {
            return (
                isValid
                && this.tvmWallet.isReady
                && isEverscaleAddressValid(this.leftAddress)
                && isEvmAddressValid(this.rightAddress)
            )
        }

        return false
    }

    public get isAssetValid(): boolean {
        const isValid = (
            this.data.selectedToken !== undefined
            && this.amount.length > 0
            && isGoodBignumber(this.amount)
            && !this.pipeline?.isBlacklisted
        )

        if (this.isEvmEvm) {
            return (
                isValid
                && this.evmWallet.isConnected
                && !this.secondPipeline?.isBlacklisted
                && this.isAmountValid
                && this.isEnoughEvmBalance
            )
        }

        if (this.isEvmTvm) {
            if (this.isSwapEnabled) {
                return (
                    isValid
                    && this.evmWallet.isConnected
                    && this.isAmountValid
                    && this.isExpectedEversAmountValid
                )
            }
            return isValid && this.evmWallet.isConnected && this.isAmountValid
        }

        if (this.isTvmEvm) {
            if (this.isSwapEnabled) {
                return (
                    isValid
                    && this.tvmWallet.isConnected
                    && this.isAmountValid
                    && this.isExpectedEversAmountValid
                )
            }
            return isValid && this.tvmWallet.isConnected && this.isAmountValid
        }

        if (this.isFromSolana) {
            return isValid && this.solanaWallet.isConnected
        }

        return false
    }

    /*
     * Approvals state values
     * ----------------------------------------------------------------------------------
     */

    public get approvalStrategy(): CrosschainBridgeStoreState['approvalStrategy'] {
        return this.state.approvalStrategy
    }

    public get isPendingAllowance(): CrosschainBridgeStoreState['isPendingAllowance'] {
        return this.state.isPendingAllowance
    }

    public get isPendingApproval(): CrosschainBridgeStoreState['isPendingApproval'] {
        return this.state.isPendingApproval
    }

    public get isAmountMaxValueValid(): boolean {
        const isGood = this.amount.length > 0 && isGoodBignumber(this.amount)
        if (isGood && this.isTvmEvm && this.isNativeTvmCurrency) {
            return this.isEnoughWeverBalance || this.isEnoughEverBalance || this.isEnoughComboBalance
        }
        if (isGood && this.isFromEvm && this.isNativeEvmCurrency) {
            return this.amount.length > 0 ? (isGoodBignumber(this.amount) && this.isEnoughEvmBalance) : true
        }
        if (isGood) {
            const balanceNumber = BigNumber(this.balance || 0).shiftedBy(this.decimals ? -this.decimals : 0)
            return validateMaxValue(balanceNumber.toFixed(), this.amountNumber.toFixed())
        }
        return true
    }

    public get isAmountMinValueValid(): boolean {
        if (this.isEvmTvm && this.amount.length > 0 && isGoodBignumber(this.amountNumber)) {
            return validateMinValue(this.minAmount, this.amountNumber.toFixed())
        }
        return true
    }

    public get isExpectedEversAmountValid(): boolean {
        return this.expectedEversAmountNumber.lte(this.maxExpectedEversAmount || 0)
    }

    public get isInsufficientVaultBalance(): boolean {
        if (this.isTvmSolana) {
            return BigNumber(this.pipeline?.vaultBalance ?? 0)
                .shiftedBy(-(this.pipeline?.solanaTokenDecimals ?? 0))
                .lt(this.amountNumber)
        }
        if (this.isEvmEvm) {
            return BigNumber(this.secondPipeline?.vaultBalance ?? 0)
                .shiftedBy(-(this.secondPipeline?.evmTokenDecimals ?? 0))
                .lt(this.amountNumber)
        }
        return BigNumber(this.pipeline?.vaultBalance ?? 0)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals ?? 0))
            .lt(this.amountNumber)
    }

    public get isEnoughWeverBalance(): boolean {
        return BigNumber(this.token?.balance || 0).shiftedBy(-this.tvmWallet.coin.decimals).gte(this.amountNumber)
    }

    public get isEnoughEverBalance(): boolean {
        return BigNumber(this.tvmWallet.balance || 0)
            .minus(this.isSwapEnabled ? this.minEversAmount ?? EverSafeAmount : EverSafeAmount)
            .shiftedBy(-this.tvmWallet.coin.decimals)
            .gte(this.amountNumber)
    }

    public get isEnoughTvmBalance(): boolean {
        const eventInitialBalance = BigNumber(this.data.eventInitialBalance ?? 0)
            .shiftedBy(-this.tvmWallet.coin.decimals)
        return this.tvmWallet.balanceNumber.gte(
            this.isSwapEnabled
                ? this.tvmEvmCost || 0
                : eventInitialBalance,
        )
    }

    public get isEnoughComboBalance(): boolean {
        return BigNumber(this.token?.balance || 0)
            .plus(this.tvmWallet.balance || 0)
            .minus(this.isSwapEnabled ? this.minEversAmount ?? EverSafeAmount : EverSafeAmount)
            .shiftedBy(-this.tvmWallet.coin.decimals)
            .gte(this.amountNumber)
    }

    public get isEnoughEvmBalance(): boolean {
        if (this.isNativeEvmCurrency && this.evmWallet.chainId === this.token?.chainId) {
            return this.evmWallet.balanceNumber.gte(this.amountNumber.plus(this.evmTvmCost || 0))
        }

        return this.evmWallet.balanceNumber.gt(this.evmTvmCost || 0)
    }

    /*
     * Liquidity requests computed values
     * ----------------------------------------------------------------------------------
     */

    public get evmPendingWithdrawal(): CrosschainBridgeStoreData['evmPendingWithdrawal'] {
        return this.data.evmPendingWithdrawal
    }

    public get pendingWithdrawalsAmount(): string | undefined {
        return this.pendingWithdrawals?.reduce((acc, item) => acc.plus(item.amount), BigNumber(0)).toFixed()
    }

    public get pendingWithdrawalsBounty(): string | undefined {
        return this.pendingWithdrawals?.reduce((acc, item) => acc.plus(item.bounty), BigNumber(0)).toFixed()
    }

    public get pendingWithdrawals(): PendingWithdrawal[] | undefined {
        if (!this.data.pendingWithdrawals) {
            return undefined
        }

        return this.data.pendingWithdrawals.filter(item => {
            const isApproved = item.approveStatus === '0' || item.approveStatus === '2'
            const hasAmount = item.amount !== '0'
            return isApproved && hasAmount
        })
    }

    /*
     * Utilities values
     * ----------------------------------------------------------------------------------
     */

    public get txHash(): CrosschainBridgeStoreData['txHash'] {
        return this.data.txHash
    }

    /**
     *
     */
    public resetAsset(): void {
        this.setData({
            amount: '',
            bridgeFee: undefined,
            eventInitialBalance: undefined,
            expectedEversAmount: undefined,
            gasPrice: undefined,
            gasUsage: undefined,
            maxTransferFee: undefined,
            minTransferFee: undefined,
            pipeline: undefined,
            rate: undefined,
            secondPipeline: undefined,
            selectedToken: undefined,
        })
        this.setState({
            isCalculating: false,
            isFetching: false,
            isLocked: false,
            isPendingAllowance: false,
            isPendingApproval: false,
            isProcessing: false,
            isSwapEnabled: false,
        })
    }

    /**
     * Reset data and state to their defaults
     * @protected
     */
    protected reset(): void {
        this.setData(() => DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA)
        this.setState(() => DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE)
    }

    protected async handleEvmPendingWithdrawal(): Promise<void> {
        if (!this.evmPendingWithdrawal || this.pipeline?.vaultAddress === undefined) {
            return
        }

        const network = findNetwork(this.pipeline.chainId, 'evm')

        if (network === undefined) {
            return
        }

        const { withdrawalIds } = this.evmPendingWithdrawal

        const vaultContract = evmMultiVaultContract(this.pipeline.vaultAddress.toString(), network.rpcUrl)

        try {
            const pendingWithdrawals = (
                await Promise.all(
                    withdrawalIds.map(item => vaultContract.methods.pendingWithdrawals(item.recipient, item.id).call()),
                )
            ).map((item, idx) => ({
                amount: item.amount,
                approveStatus: item.approveStatus,
                bounty: item.bounty,
                id: withdrawalIds[idx].id,
                recipient: withdrawalIds[idx].recipient,
                timestamp: item.timestamp,
            }))

            this.setData('pendingWithdrawals', pendingWithdrawals)
        }
        catch (e) {
            error(e)
        }
    }

    protected async handleEvmWalletConnection(address?: string): Promise<void> {
        if (this.state.isProcessing) {
            return
        }

        if (address) {
            if (this.leftNetwork?.type === 'evm') {
                this.setData('leftAddress', address)
            }

            if (this.rightNetwork?.type === 'evm') {
                this.setData('rightAddress', address)
            }

            if (this.data.selectedToken) {
                await this.changeToken(this.data.selectedToken).catch(error)
            }
        }
        else {
            if (this.leftNetwork?.type === 'evm') {
                this.setData('leftAddress', '')
            }

            if (this.rightNetwork?.type === 'evm') {
                this.setData('rightAddress', '')
            }

            this.resetAsset()
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }

    protected async handleTvmWalletConnection(address?: string): Promise<void> {
        if (this.state.isProcessing) {
            return
        }

        if (address) {
            if (this.leftNetwork?.type === 'tvm') {
                this.setData('leftAddress', address)
            }

            if (this.rightNetwork?.type === 'tvm') {
                this.setData('rightAddress', address)
            }

            if (this.data.selectedToken) {
                await this.changeToken(this.data.selectedToken).catch(error)
            }
        }
        else {
            if (this.leftNetwork?.type === 'tvm') {
                this.setData('leftAddress', '')
            }

            if (this.rightNetwork?.type === 'tvm') {
                this.setData('rightAddress', '')
            }

            // @ts-ignore
            this.token?.setData('balance', undefined)
            this.resetAsset()
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }

    protected async handleSolanaWalletConnection(address?: string): Promise<void> {
        if (this.state.isProcessing) {
            return
        }

        if (address) {
            if (this.leftNetwork?.type === 'solana') {
                this.setData('leftAddress', address)
            }

            if (this.rightNetwork?.type === 'solana') {
                this.setData('rightAddress', address)
            }
        }
        else {
            if (this.leftNetwork?.type === 'solana') {
                this.setData('leftAddress', '')
            }

            if (this.rightNetwork?.type === 'solana') {
                this.setData('rightAddress', '')
            }

            this.resetAsset()
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }

    protected tvmWalletDisposer: IReactionDisposer | undefined

    protected evmWalletDisposer: IReactionDisposer | undefined

    protected solanaWalletDisposer: IReactionDisposer | undefined

    protected evmPendingWithdrawalDisposer: IReactionDisposer | undefined

}
