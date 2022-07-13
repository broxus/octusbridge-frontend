import BigNumber from 'bignumber.js'
import { Address } from 'everscale-inpage-provider'
import isEqual from 'lodash.isequal'
import {
    action, computed, IReactionDisposer, makeObservable, reaction, toJS,
} from 'mobx'

import {
    CreditBody,
    CreditFactoryAddress,
    DepositToFactoryMaxSlippage,
    DepositToFactoryMinSlippageDenominator,
    DepositToFactoryMinSlippageNumerator,
    EmptyWalletMinEversAmount,
    HiddenBridgeStrategyFactory,
    HiddenBridgeStrategyGas,
    networks,
    WEVERRootAddress,
} from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import { Dex, DexConstants, EthAbi } from '@/misc'
import {
    DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA,
    DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    NetworkFields,
    PendingWithdrawal,
} from '@/modules/Bridge/types'
import { unshiftedAmountWithSlippage } from '@/modules/Bridge/utils'
import { BaseStore } from '@/stores/BaseStore'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import type { NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    getEverscaleMainNetwork,
    isEverscaleAddressValid,
    isEvmAddressValid,
    isGoodBignumber,
    storage,
    validateMaxValue,
    validateMinValue,
} from '@/utils'
import { BridgeAsset, BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { EverscaleToken, EvmToken, Pipeline } from '@/models'
import { erc20TokenContract, evmVaultContract } from '@/misc/eth-contracts'
import {
    creditFactoryContract,
    dexPairContract,
    everscaleEventConfigurationContract,
    getFullContractState,
    hiddenBridgeFactoryContract,
    hiddenBridgeStrategyContract,
    tokenWalletContract,
} from '@/misc/contracts'

export class CrosschainBridge extends BaseStore<CrosschainBridgeStoreData, CrosschainBridgeStoreState> {

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
    ) {
        super()

        this.reset()

        makeObservable<
            CrosschainBridge,
            | 'debt'
            | 'handleChangeToken'
            | 'handleEvmWalletConnection'
            | 'handleEverWalletConnection'
            | 'handleEverWalletBalance'
            | 'handleEvmPendingWithdrawal'
        >(this, {
            handleChangeToken: action.bound,
            handleEvmWalletConnection: action.bound,
            handleEverWalletConnection: action.bound,
            handleEverWalletBalance: action.bound,
            handleEvmPendingWithdrawal: action.bound,
            amount: computed,
            maxTokenAmount: computed,
            maxEversAmount: computed,
            maxTransferFee: computed,
            minAmount: computed,
            minEversAmount: computed,
            minTransferFee: computed,
            tokenAmount: computed,
            eversAmount: computed,
            depositType: computed,
            minReceiveTokens: computed,
            leftAddress: computed,
            leftNetwork: computed,
            pipeline: computed,
            rightAddress: computed,
            rightNetwork: computed,
            txHash: computed,
            approvalStrategy: computed,
            isCalculating: computed,
            isFetching: computed,
            isLocked: computed,
            isPendingAllowance: computed,
            isPendingApproval: computed,
            isSwapEnabled: computed,
            step: computed,
            amountNumber: computed,
            amountMinDecimals: computed,
            balance: computed,
            balanceNumber: computed,
            decimals: computed,
            minAmountNumber: computed,
            minReceiveTokensNumber: computed,
            isAmountVaultLimitExceed: computed,
            isAmountMinValueValid: computed,
            isAmountMaxValueValid: computed,
            isAmountValid: computed,
            isTokensAmountValid: computed,
            isEversAmountValid: computed,
            isAssetValid: computed,
            isRouteValid: computed,
            isCreditAvailable: computed,
            isInsufficientEverBalance: computed,
            isInsufficientVaultBalance: computed,
            isEverscaleBasedToken: computed,
            isEvmToEvm: computed,
            isEvmToEverscale: computed,
            isFromEvm: computed,
            isFromEverscale: computed,
            isEverscaleToEvm: computed,
            rightNetworks: computed,
            token: computed,
            vaultBalance: computed,
            vaultBalanceDecimals: computed,
            vaultLimitNumber: computed,
            tokens: computed,
            tokenAmountNumber: computed,
            eversAmountNumber: computed,
            debt: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useBridgeAssets: computed,
            evmPendingWithdrawal: computed,
        })
    }


    /*
     * Public actions. Useful in UI
     * ----------------------------------------------------------------------------------
     */

    /**
     * Change network by the given key and value.
     * @template {string} K
     * @param {K extends keyof NetworkFields} key
     * @param {NetworkFields[K]} value
     */
    public changeNetwork<K extends keyof NetworkFields>(key: K, value: NetworkFields[K]): void {
        if (value === undefined) {
            return
        }

        if (key === 'leftNetwork') {
            const { leftAddress, rightAddress } = this
            if (value.type === 'everscale') {
                this.setData('leftAddress', this.everWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.setData('leftAddress', this.evmWallet.address || '')
            }
            if (value.id === this.rightNetwork?.id) {
                this.setData({
                    rightNetwork: this.leftNetwork,
                    rightAddress: leftAddress,
                    leftAddress: rightAddress,
                })
            }
        }
        else if (key === 'rightNetwork') {
            if (value.type === 'everscale') {
                this.setData('rightAddress', this.everWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.setData('rightAddress', this.evmWallet.address || '')
            }
        }

        this.resetAsset()
        this.setData({
            [key]: value,
            depositType: this.isEvmToEvm ? 'credit' : 'default',
        })
    }

    /**
     * Manually initiate store.
     * Run all necessary reaction subscribers.
     */
    public init(): void {
        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, this.handleEvmWalletConnection)
        this.#swapDisposer = reaction(() => this.isSwapEnabled, async isEnabled => {
            this.setData('depositType', isEnabled ? 'credit' : 'default')
            if (isEnabled) {
                await this.syncMinAmount()
            }
            else {
                this.setData('minAmount', '')
            }
        })
        this.#tokenDisposer = reaction(() => this.data.selectedToken, this.handleChangeToken)
        this.#everWalletDisposer = reaction(() => this.everWallet.isConnected, this.handleEverWalletConnection)
        this.#everWalletBalanceDisposer = reaction(
            () => [this.everWallet.balance, this.everWallet.isContractUpdating],
            this.handleEverWalletBalance,
        )
    }

    /**
     * Manually dispose of all reaction subscribers.
     * Reset all data to their defaults.
     */
    public dispose(): void {
        this.#evmWalletDisposer?.()
        this.#swapDisposer?.()
        this.#everWalletDisposer?.()
        this.#everWalletBalanceDisposer?.()
        this.#tokenDisposer?.()
        this.reset()
    }

    /**
     * Approve amount, using approval strategies:
     * - `infinity` - approve once and never ask again, otherwise
     * - `fixed` - only for current transaction.
     */
    public async approveAmount(): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
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
                tries += 1

                let r

                const tokenContract = new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, this.pipeline.evmTokenAddress)

                if (this.approvalStrategy === 'infinity') {
                    r = tokenContract.methods.approve(
                        this.pipeline.vaultAddress,
                        '340282366920938463426481119284349108225',
                    )
                }
                else {
                    r = tokenContract.methods.approve(
                        this.pipeline.vaultAddress,
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
                        type: transactionType,
                        gas,
                    })
                    this.setState('step', CrosschainBridgeStep.TRANSFER)
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
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
                .methods.allowance(
                    this.evmWallet.address,
                    this.pipeline.vaultAddress,
                )
                .call()

            const approvalDelta = new BigNumber(allowance).minus(
                this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN),
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
     * Common transfer tokens from EVM to Everscale.
     * @param {() => void} reject
     */
    public async transfer(reject?: (e: any) => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.evmWallet.address === undefined
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
            ) {
                return
            }

            this.setState('isProcessing', true)

            try {
                tries += 1

                const target = this.rightAddress.split(':')

                let r

                const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipeline.vaultAddress)

                if (this.pendingWithdrawalsBounty && this.pendingWithdrawals) {
                    r = vaultContract.methods.deposit(
                        [target[0], `0x${target[1]}`],
                        this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed(),
                        this.pendingWithdrawalsBounty,
                        this.pendingWithdrawals.map(item => ({
                            recipient: item.recipient,
                            id: item.id,
                        })),
                    )
                }
                else {
                    r = vaultContract.methods.deposit(
                        [target[0], `0x${target[1]}`],
                        this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
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
                        type: transactionType,
                        gas,
                    }).once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLocaleString())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Transfer deposit error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Transfer deposit error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Transfer from EVM to Everscale with swap tokens between selected token and EVERs.
     * @param {() => void} reject
     */
    public async transferWithSwap(reject?: (e: any) => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.evmWallet.address === undefined
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
            ) {
                return
            }

            this.setState('isProcessing', true)

            const target = this.rightAddress.split(':')
            const creditFactoryTarget = CreditFactoryAddress.toString().split(':')

            try {
                tries += 1

                const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipeline.vaultAddress)

                const r = vaultContract.methods.depositToFactory(
                    this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    '0',
                    `0x${target[1]}`,
                    `0x${creditFactoryTarget[1]}`,
                    `0x${target[1]}`,
                    this.minReceiveTokensNumber.toFixed(),
                    this.eversAmountNumber.shiftedBy(DexConstants.CoinDecimals).toFixed(),
                    this.data.swapType,
                    DepositToFactoryMinSlippageNumerator,
                    DepositToFactoryMinSlippageDenominator,
                    `0x${Buffer.from('te6ccgEBAQEAAgAAAA==', 'base64').toString('hex')}`,
                )

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
                    }).once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Transfer deposit to factory error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Transfer deposit to factory error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Transfer from EVM to EVM with the Hidden Bridge strategy.
     * @param {() => void} reject
     */
    public async transferWithHiddenSwap(reject?: (e: any) => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.everWallet.address === undefined
                || this.evmWallet.web3 === undefined
                || this.token === undefined
                || this.rightNetwork === undefined
                || this.pipeline?.evmTokenDecimals === undefined
                || this.pipeline.everscaleTokenAddress === undefined
            ) {
                return
            }

            const target = this.everWallet.address.split(':')
            const creditFactoryTarget = CreditFactoryAddress.toString().split(':')

            this.setState('isProcessing', true)

            try {
                tries += 1

                const recipient = (await hiddenBridgeFactoryContract(HiddenBridgeStrategyFactory)
                    .methods.getStrategyAddress({
                        answerId: 0,
                        tokenRoot: this.pipeline.everscaleTokenAddress,
                    })
                    .call())
                    .value0

                const processingId = new BigNumber(
                    Math.floor(
                        Math.random() * (Number.MAX_SAFE_INTEGER - 1),
                    ) + 1,
                ).toFixed()

                const payload = (await hiddenBridgeStrategyContract(recipient)
                    .methods.buildLayer3({
                        chainId: this.rightNetwork.chainId,
                        evmAddress: this.rightAddress,
                        id: processingId,
                        proxy: this.pipeline.proxyAddress,
                    })
                    .call())
                    .value0

                const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipeline.vaultAddress)

                const r = vaultContract.methods.depositToFactory(
                    this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    '0',
                    `0x${target[1]}`,
                    `0x${creditFactoryTarget[1]}`,
                    `0x${recipient.toString().split(':')[1]}`,
                    this.minReceiveTokensNumber.toFixed(),
                    HiddenBridgeStrategyGas,
                    this.data.swapType,
                    DepositToFactoryMinSlippageNumerator,
                    DepositToFactoryMinSlippageDenominator,
                    `0x${Buffer.from(payload, 'base64').toString('hex')}`,
                )

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
                    }).once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Transfer deposit to factory error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Transfer deposit to factory error', e)
                }
            }
            finally {
                this.setState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Prepare transfer from Everscale to EVM.
     * - For EVM-based token we should burn everscale token.
     * - For Everscale-based token we should transfer everscale token to proxy.
     * @param {() => void} reject
     */
    public async prepareEverscaleToEvm(reject?: (e: any) => void): Promise<void> {
        if (
            this.rightNetwork?.chainId === undefined
            || (this.token as EverscaleToken) === undefined
            || (this.token as EverscaleToken)?.wallet === undefined
            || this.token?.decimals === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.everWallet.account?.address === undefined
        ) {
            return
        }

        this.setState('isProcessing', true)

        const walletContract = tokenWalletContract((this.token as EverscaleToken).wallet as Address)
        const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)

        const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
        const startLt = everscaleConfigState?.lastTransactionId?.lt

        const subscriber = new staticRpc.Subscriber()

        try {
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
                                { name: 'wid', type: 'int8' },
                                { name: 'addr', type: 'uint256' },
                                { name: 'tokens', type: 'uint128' },
                                { name: 'eth_addr', type: 'uint160' },
                                { name: 'chainId', type: 'uint32' },
                            ] as const,
                        })
                        const checkAddress = `${event.data.wid}:${new BigNumber(event.data.addr).toString(16).padStart(64, '0')}`
                        const checkEvmAddress = `0x${new BigNumber(event.data.eth_addr).toString(16).padStart(40, '0')}`

                        if (
                            checkAddress.toLowerCase() === this.leftAddress.toLowerCase()
                            && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                        ) {
                            const eventAddress = await everscaleConfigContract
                                .methods.deriveEventAddress({
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

            const data = await staticRpc.packIntoCell({
                data: {
                    addr: this.rightAddress,
                    chainId: this.rightNetwork.chainId,
                },
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ] as const,
            })

            if (this.isEverscaleBasedToken) {
                debug('Transfer Everscale-based token to proxy')
                await walletContract
                    .methods.transfer({
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                        deployWalletValue: '200000000',
                        notify: true,
                        payload: data.boc,
                        recipient: this.pipeline.proxyAddress,
                        remainingGasTo: this.everWallet.account.address,
                    })
                    .send({
                        amount: '6000000000',
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }
            else {
                debug('Burn EVM-based token to proxy')
                await walletContract
                    .methods.burn({
                        callbackTo: this.pipeline.proxyAddress,
                        payload: data.boc,
                        remainingGasTo: this.everWallet.account.address,
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    })
                    .send({
                        amount: '6000000000',
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }

            const eventAddress = await eventStream

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Prepare Everscale to EVM error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     *
     */
    public async transferAlienMultiToken(reject?: (e: any) => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
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

            this.setState('isProcessing', true)

            try {
                tries += 1

                const target = this.rightAddress.split(':')

                const vaultContract = new this.evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress,
                )

                const r = vaultContract.methods.deposit(
                    [target[0], `0x${target[1]}`],
                    this.pipeline.evmTokenAddress,
                    this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                )

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
                    }).once('transactionHash', (transactionHash: string) => {
                        this.setData('txHash', transactionHash)
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Transfer deposit error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Transfer Alien MultiToken error', e)
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
     * @param reject
     */
    public async transferNativeMultiToken(reject?: (e: any) => void): Promise<void> {
        if (
            this.everWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.everWallet.account?.address === undefined
        ) {
            return
        }

        const network = findNetwork(this.pipeline.chainId, 'evm')

        if (network === undefined) {
            return
        }

        this.setState('isProcessing', true)

        const walletContract = tokenWalletContract((this.token as EverscaleToken).wallet as Address)
        const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)

        const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
        const startLt = everscaleConfigState?.lastTransactionId?.lt

        const subscriber = new staticRpc.Subscriber()

        try {
            const eventStream = subscriber.transactions(everscaleConfigContract.address)
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
                                { name: 'proxy', type: 'address' },
                                { name: 'tokenWallet', type: 'address' },
                                { name: 'token', type: 'address' },
                                { name: 'remainingGasTo', type: 'address' },
                                { name: 'amount', type: 'uint128' },
                                { name: 'recipient', type: 'uint160' },
                                { name: 'chainId', type: 'uint256' },
                            ] as const,
                        })
                        const checkEvmAddress = `0x${new BigNumber(event.data.recipient).toString(16).padStart(40, '0')}`

                        if (
                            event.data.remainingGasTo.toString().toLowerCase() === this.leftAddress.toLowerCase()
                        && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                        ) {
                            const eventAddress = await everscaleConfigContract
                                .methods.deriveEventAddress({
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

            const data = await staticRpc.packIntoCell({
                data: {
                    addr: this.rightAddress,
                    chainId: this.rightNetwork.chainId,
                },
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                ] as const,
            })

            await walletContract
                .methods.transfer({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    deployWalletValue: '200000000',
                    notify: true,
                    payload: data.boc,
                    recipient: this.pipeline.proxyAddress,
                    remainingGasTo: this.everWallet.account.address,
                })
                .send({
                    amount: '6000000000',
                    bounce: true,
                    from: new Address(this.leftAddress),
                })

            if (this.pipeline.isMultiVault && this.token !== undefined) {
                try {
                    const { chainId, type } = this.rightNetwork

                    const [wid, addr] = this.token.root.split(':')
                    const root = (await evmVaultContract(this.pipeline.vaultAddress, network.rpcUrl)
                        .methods.getNativeToken(wid, `0x${addr}`)
                        .call())
                        .toLowerCase()
                    const key = `${type}-${chainId}-${root}`

                    let name,
                        symbol

                    try {
                        [name, symbol] = await Promise.all([
                            erc20TokenContract(root, network.rpcUrl).methods.name().call(),
                            erc20TokenContract(root, network.rpcUrl).methods.symbol().call(),
                        ])
                    }
                    catch (e) {
                        const [
                            activation,
                            namePrefix,
                            symbolPrefix,
                        ] = await evmVaultContract(this.pipeline.vaultAddress, network.rpcUrl)
                            .methods.prefixes(root.toLowerCase())
                            .call()

                        name = `${activation === '0' ? 'Octus ' : namePrefix}${this.token.name}`
                        symbol = `${activation === '0' ? 'oct' : symbolPrefix}${this.token.symbol}`
                    }

                    const asset = {
                        root,
                        decimals: this.token.decimals,
                        name,
                        symbol,
                        key,
                        chainId,
                        icon: this.token.icon,
                    }

                    this.bridgeAssets.add(new EvmToken(asset))

                    const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

                    importedAssets[key] = asset

                    storage.set('imported_assets', JSON.stringify(importedAssets))
                }
                catch (e) {
                    //
                }
            }

            const eventAddress = await eventStream

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Transfer Native MultiToken error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     *
     * @param reject
     */
    public async burnViaAlienProxy(reject?: (e: any) => void): Promise<void> {
        if (
            this.everWallet.account?.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || (this.token as EverscaleToken)?.wallet === undefined
            || this.pipeline?.everscaleConfiguration === undefined
        ) {
            return
        }

        this.setState('isProcessing', true)

        const everscaleConfigContract = everscaleEventConfigurationContract(this.pipeline.everscaleConfiguration)
        const walletContract = tokenWalletContract((this.token as EverscaleToken)?.wallet as Address)

        const everscaleConfigState = await getFullContractState(everscaleConfigContract.address)
        const startLt = everscaleConfigState?.lastTransactionId?.lt

        const subscriber = new staticRpc.Subscriber()

        try {
            const eventStream = subscriber.transactions(everscaleConfigContract.address)
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
                                { name: 'proxy', type: 'address' },
                                { name: 'token', type: 'address' },
                                { name: 'remainingGasTo', type: 'address' },
                                { name: 'amount', type: 'uint128' },
                                { name: 'recipient', type: 'uint160' },
                            ] as const,
                        })

                        const checkEvmAddress = `0x${new BigNumber(event.data.recipient).toString(16).padStart(40, '0')}`

                        if (
                            event.data.remainingGasTo.toString().toLowerCase() === this.leftAddress.toLowerCase()
                            && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                        ) {
                            const eventAddress = await everscaleConfigContract
                                .methods.deriveEventAddress({
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

            if (
                this.pipeline.mergePoolAddress !== undefined
                && this.pipeline.mergeEverscaleTokenAddress !== undefined
            ) {
                const operationPayload = await staticRpc.packIntoCell({
                    data: {
                        addr: this.rightAddress,
                    },
                    structure: [
                        { name: 'addr', type: 'uint160' },
                    ] as const,
                })

                const data = await staticRpc.packIntoCell({
                    data: {
                        type: 0,
                        targetToken: this.pipeline.mergeEverscaleTokenAddress,
                        operationPayload: operationPayload.boc,
                    },
                    structure: [
                        { name: 'type', type: 'uint8' },
                        { name: 'targetToken', type: 'address' },
                        { name: 'operationPayload', type: 'cell' },
                    ] as const,
                })

                await walletContract
                    .methods.burn({
                        callbackTo: this.pipeline.mergePoolAddress,
                        payload: data.boc,
                        remainingGasTo: this.everWallet.account.address,
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    })
                    .send({
                        amount: '6000000000',
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }
            else {
                const data = await staticRpc.packIntoCell({
                    data: {
                        addr: this.rightAddress,
                    },
                    structure: [
                        { name: 'addr', type: 'uint160' },
                    ] as const,
                })

                await walletContract
                    .methods.burn({
                        callbackTo: this.pipeline.proxyAddress,
                        payload: data.boc,
                        remainingGasTo: this.everWallet.account.address,
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    })
                    .send({
                        amount: '6000000000',
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }

            const eventAddress = await eventStream

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.(e)
            error('Transfer Native Proxy MultiToken error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.setState('isProcessing', false)
        }
    }

    /**
     * Should be called after manually change amount field value for EVM-Everscale or EVM-EVM modes.
     * - EVM-EVM check min receive tokens
     * - EVM-Everscale (swap mode) sync max EVERs amount, sync min receive and tokens amounts.
     */
    public async onChangeAmount(): Promise<void> {
        if (this.isEvmToEvm) {
            this.checkMinReceiveTokens()
            return
        }

        if (!this.isSwapEnabled) {
            return
        }

        try {
            this.setState('isCalculating', true)

            await this.syncMaxEversAmount()

            if (!this.amount || this.amountNumber.isZero()) {
                this.setData({
                    eversAmount: this.isInsufficientEverBalance
                        ? new BigNumber(EmptyWalletMinEversAmount).shiftedBy(-DexConstants.CoinDecimals).toFixed()
                        : this.eversAmount,
                    maxTokenAmount: '',
                    minReceiveTokens: '',
                    tokenAmount: '',
                })
                return
            }

            await this.syncMinReceiveTokens()

            if (isGoodBignumber(this.minReceiveTokensNumber)) {
                await this.syncTokensAmount()
            }
        }
        catch (e) {
            error('Change amount recalculate error', e)
        }
        finally {
            this.setState('isCalculating', false)
        }
    }

    /**
     *
     */
    public async onChangeTokensAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.token === undefined
            || this.pipeline?.everscaleTokenAddress === undefined
            || this.decimals === undefined
            || this.data.pairAddress === undefined
        ) {
            return
        }

        try {
            this.setState('isCalculating', true)

            const maxTotalEversAmount = (await dexPairContract(this.data.pairAddress)
                .methods.expectedExchange({
                    answerId: 0,
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    spent_token_root: this.pipeline.everscaleTokenAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const maxEversAmountNumber = new BigNumber(maxTotalEversAmount || 0)
                .times(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .shiftedBy(-DexConstants.CoinDecimals)
                .minus(this.debt)
                .dp(DexConstants.CoinDecimals, BigNumber.ROUND_DOWN)

            if (this.tokenAmountNumber.isZero()) {
                const data: Partial<CrosschainBridgeStoreData> = {
                    minReceiveTokens: '',
                    tokenAmount: '0',
                    swapType: '1',
                }

                if (isGoodBignumber(maxEversAmountNumber)) {
                    data.eversAmount = maxEversAmountNumber.toFixed()
                }

                this.setData(data)
            }
            else {
                const minSpentTokensNumber = this.amountNumber.minus(this.tokenAmountNumber)

                const toExchangeAmount = (await dexPairContract(this.data.pairAddress)
                    .methods.expectedExchange({
                        answerId: 0,
                        amount: minSpentTokensNumber
                            .shiftedBy(this.token.decimals)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed(),
                        spent_token_root: this.pipeline.everscaleTokenAddress,
                    })
                    .call({
                        cachedState: toJS(this.data.pairState),
                    })).expected_amount

                const eversAmountNumber = new BigNumber(toExchangeAmount || 0)
                    .times(new BigNumber(100).minus(
                        new BigNumber(DepositToFactoryMinSlippageNumerator)
                            .div(DepositToFactoryMinSlippageDenominator)
                            .toFixed(),
                    ))
                    .div(100)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .shiftedBy(-DexConstants.CoinDecimals)
                    .minus(this.debt)
                    .dp(DexConstants.CoinDecimals, BigNumber.ROUND_DOWN)

                this.setData('swapType', '0')

                const maxSpendTokens = (await dexPairContract(this.data.pairAddress)
                    .methods.expectedSpendAmount({
                        answerId: 0,
                        receive_amount: this.debt
                            .plus(eversAmountNumber)
                            .times(100)
                            .div(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                            .shiftedBy(DexConstants.CoinDecimals)
                            .dp(0, BigNumber.ROUND_UP)
                            .toFixed(),
                        receive_token_root: WEVERRootAddress,
                    })
                    .call({
                        cachedState: toJS(this.data.pairState),
                    }))
                    .expected_amount

                const minTokensAmountNumber = this.amountNumber.shiftedBy(this.token.decimals).minus(maxSpendTokens)

                if (isGoodBignumber(minTokensAmountNumber)) {
                    this.setData('minReceiveTokens', minTokensAmountNumber.toFixed())

                    if (isGoodBignumber(eversAmountNumber) || eversAmountNumber.isZero()) {
                        this.setData('eversAmount', eversAmountNumber.toFixed())
                        this.checkSwapCredit()
                        this.checkMinEvers()
                    }
                }
                else {
                    this.setData({
                        minReceiveTokens: '0',
                        swapType: '1',
                        tokenAmount: '0',
                    })

                    if (isGoodBignumber(maxEversAmountNumber)) {
                        this.setData('eversAmount', maxEversAmountNumber.toFixed())
                        this.checkSwapCredit()
                        this.checkMinEvers()
                    }
                }
            }
        }
        catch (e) {
            error('Change tokens amount recalculate error', e)
        }
        finally {
            this.setState('isCalculating', false)
        }
    }

    /**
     *
     */
    public async onChangeEversAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.data.pairAddress === undefined
            || this.decimals === undefined
            || this.token === undefined
        ) {
            return
        }

        try {
            this.setState('isCalculating', true)

            const maxSpendTokens = (await dexPairContract(this.data.pairAddress)
                .methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .plus(this.eversAmountNumber)
                        .times(100)
                        .div(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                        .shiftedBy(DexConstants.CoinDecimals)
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: WEVERRootAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const minTokensAmountNumber = this.amountNumber.shiftedBy(this.amountMinDecimals).minus(maxSpendTokens || 0)

            if (isGoodBignumber(minTokensAmountNumber)) {
                this.setData({
                    minReceiveTokens: minTokensAmountNumber.toFixed(),
                    swapType: '0',
                })
            }
            else {
                this.setData({
                    minReceiveTokens: '',
                    tokenAmount: '',
                })
                return
            }

            const minSpendTokens = (await dexPairContract(this.data.pairAddress)
                .methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .plus(this.eversAmountNumber)
                        .times(100)
                        .div(new BigNumber(100).minus(
                            new BigNumber(DepositToFactoryMinSlippageNumerator)
                                .div(DepositToFactoryMinSlippageDenominator)
                                .toFixed(),
                        ))
                        .shiftedBy(DexConstants.CoinDecimals)
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: WEVERRootAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const tokensAmountNumber = this.amountNumber
                .shiftedBy(this.amountMinDecimals)
                .minus(minSpendTokens || 0)
                .shiftedBy(-this.token.decimals)

            if (isGoodBignumber(tokensAmountNumber)) {
                this.setData({
                    swapType: '0',
                    tokenAmount: tokensAmountNumber.toFixed(),
                })
            }
        }
        catch (e) {
            error('Change evers amount recalculate error', e)
        }
        finally {
            this.setState('isCalculating', false)
        }
    }

    /**
     *
     * @protected
     */
    public async onSwapToggle(): Promise<void> {
        this.setState('isFetching', true)
        if (
            this.token?.root !== undefined
            && this.leftNetwork?.type !== undefined
            && this.leftNetwork?.chainId !== undefined
            && this.rightNetwork?.type !== undefined
            && this.rightNetwork?.chainId !== undefined
        ) {
            const pipeline = await this.bridgeAssets.pipeline(
                this.token.root,
                `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                this.depositType,
            )

            this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
        }

        if (!this.isSwapEnabled) {
            this.setData({
                eversAmount: '',
                minAmount: '',
                tokenAmount: '',
            })
            this.setState('isFetching', false)
            return
        }

        this.checkSwapCredit()
        this.checkMinEvers()

        if (isGoodBignumber(this.amountNumber)) {
            await this.onChangeAmount()
        }
        this.setState('isFetching', false)
    }

    /**
     *
     */
    public resetAsset(): void {
        this.setData({
            amount: '',
            bridgeFee: undefined,
            depositType: this.isEvmToEvm ? 'credit' : 'default',
            eversAmount: undefined,
            hiddenBridgePipeline: undefined,
            maxTokenAmount: undefined,
            maxEversAmount: undefined,
            minAmount: undefined,
            minEversAmount: undefined,
            minReceiveTokens: undefined,
            minTransferFee: undefined,
            pairAddress: undefined,
            pairState: undefined,
            pipeline: undefined,
            tokenAmount: undefined,
        })
        this.setState({
            isCalculating: false,
            isFetching: false,
            isLocked: false,
            isPendingAllowance: false,
            isTokenChainSameToTargetChain: undefined,
        })
    }


    /*
     * Reactions handlers
     * ----------------------------------------------------------------------------------
     */

    protected async handleEvmPendingWithdrawal(): Promise<void> {
        if (!this.evmPendingWithdrawal || this.pipeline?.vaultAddress === undefined) {
            return
        }

        const network = findNetwork(this.pipeline.chainId, 'evm')

        if (network === undefined) {
            return
        }

        const { withdrawalIds } = this.evmPendingWithdrawal

        const vaultContract = evmVaultContract(this.pipeline.vaultAddress, network.rpcUrl)

        try {
            const pendingWithdrawals = (
                await Promise.all(
                    withdrawalIds.map(item => (
                        vaultContract
                            .methods.pendingWithdrawals(item.recipient, item.id)
                            .call()
                    )),
                )
            )
                .map((item, idx) => ({
                    amount: item.amount,
                    bounty: item.bounty,
                    timestamp: item.timestamp,
                    approveStatus: item.approveStatus,
                    recipient: withdrawalIds[idx].recipient,
                    id: withdrawalIds[idx].id,
                }))

            this.setData('pendingWithdrawals', pendingWithdrawals)
        }
        catch (e) {
            error(e)
        }
    }

    /**
     *
     * @param selectedToken
     * @protected
     */
    protected async handleChangeToken(selectedToken?: string): Promise<void> {
        debug('handleChangeToken', selectedToken)

        if (
            this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || selectedToken === undefined
        ) {
            return
        }

        this.resetAsset()

        try {
            this.setState('isFetching', true)

            if (
                this.token?.root !== undefined
                && this.leftNetwork?.type !== undefined
                && this.leftNetwork?.chainId !== undefined
                && this.rightNetwork?.type !== undefined
                && this.rightNetwork?.chainId !== undefined
            ) {
                const everscaleMainNetwork = getEverscaleMainNetwork()

                const pipeline = await this.bridgeAssets.pipeline(
                    this.token.root,
                    `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                    this.isEvmToEvm
                        ? `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`
                        : `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    this.depositType,
                )

                if (pipeline === undefined) {
                    this.setState('isLocked', true)
                    return
                }

                this.setData('pipeline', new Pipeline(pipeline))

                if (this.isEvmToEvm && pipeline?.everscaleTokenAddress !== undefined) {
                    const hiddenBridgePipeline = await this.bridgeAssets.pipeline(
                        pipeline.everscaleTokenAddress.toString(),
                        `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        'default',
                    )

                    if (hiddenBridgePipeline === undefined) {
                        this.setState('isLocked', true)
                        return
                    }

                    this.setData('hiddenBridgePipeline', new Pipeline(hiddenBridgePipeline))
                }
            }

            if (this.isFromEverscale) {
                this.setState(
                    'isTokenChainSameToTargetChain',
                    this.pipeline?.mergePoolAddress !== undefined
                        ? true
                        : this.pipeline?.baseChainId === this.rightNetwork?.chainId,
                )
            }

            if (this.isFromEvm && this.isCreditAvailable) {
                if (this.isEvmToEvm) {
                    await Promise.all([
                        this.everWallet.isConnected ? this.syncPair() : undefined,
                        this.syncCreditFactoryFee(),
                    ])
                    await this.syncTransferFees()
                    return
                }

                this.checkSwapCredit()
                this.checkMinEvers()

                await this.syncCreditFactoryFee()

                if (this.everWallet.isConnected) {
                    await this.syncPair()
                    if (this.isSwapEnabled) {
                        await this.syncMinAmount()
                    }
                }

                await this.handleEvmPendingWithdrawal()
            }
        }
        catch (e) {
            error(e)
            this.setState('isLocked', true)
        }
        finally {
            this.setState('isFetching', false)
            debug('Current pipeline', this.pipeline, this.hiddenBridgePipeline)
        }
    }

    /**
     *
     * @param connected
     * @protected
     */
    protected handleEvmWalletConnection(connected?: boolean): void {
        debug('handleEvmWalletConnection')

        if (this.state.isProcessing) {
            return
        }

        if (connected) {
            if (this.leftNetwork?.type === 'evm') {
                this.setData('leftAddress', this.evmWallet.address ?? '')
            }
            if (this.rightNetwork?.type === 'evm' && !this.rightAddress) {
                this.setData('rightAddress', this.evmWallet.address ?? '')
            }
        }
        else {
            this.resetAsset()
            this.setData('selectedToken', undefined)
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }

    /**
     *
     * @protected
     */
    protected handleEverWalletBalance(): void {
        debug('handleEverWalletBalance')

        if (this.isFromEvm && this.isCreditAvailable) {
            this.checkSwapCredit()
            this.checkMinEvers()
        }
    }

    /**
     *
     * @param connected
     * @protected
     */
    protected async handleEverWalletConnection(connected?: boolean): Promise<void> {
        debug('handleEverWalletConnection')

        if (this.state.isProcessing) {
            return
        }

        if (connected) {
            const everscaleNetwork = getEverscaleMainNetwork()
            if (this.isFromEvm && !this.rightAddress) {
                this.setData({
                    rightAddress: this.everWallet.address ?? '',
                    rightNetwork: everscaleNetwork,
                })
            }
            else if (this.isFromEverscale) {
                this.setData({
                    leftAddress: this.everWallet.address ?? '',
                    leftNetwork: everscaleNetwork,
                })
            }

            if (this.isFromEvm) {
                this.checkSwapCredit()
                this.checkMinEvers()
                await this.syncPair()
                if (this.isSwapEnabled) {
                    await this.syncMinAmount()
                }
                await this.onChangeAmount()
            }
        }
        else {
            this.resetAsset()
            this.setData('selectedToken', undefined)
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }


    /*
     * Internal utilities methods
     * ----------------------------------------------------------------------------------
     */

    /**
     *
     * @protected
     */
    protected checkMinEvers(): void {
        if (this.isInsufficientEverBalance && this.isSwapEnabled && !this.everWallet.isContractUpdating) {
            const isEnoughEversAmount = this.eversAmountNumber
                .shiftedBy(DexConstants.CoinDecimals)
                .gte(this.minEversAmount || 0)

            if (!isEnoughEversAmount) {
                this.setData(
                    'eversAmount',
                    new BigNumber(this.minEversAmount || 0)
                        .shiftedBy(-DexConstants.CoinDecimals)
                        .toFixed(),
                )
            }
        }
    }

    /**
     *
     * @protected
     */
    protected checkSwapCredit(): void {
        if (this.everWallet.isConnected && !this.everWallet.isContractUpdating && this.isInsufficientEverBalance) {
            if (this.step === CrosschainBridgeStep.SELECT_ASSET) {
                this.setData({
                    depositType: this.isCreditAvailable ? 'credit' : this.depositType,
                    minEversAmount: EmptyWalletMinEversAmount,
                })
            }
        }
        else {
            this.setData('minEversAmount', '0')
        }
    }

    /**
     *
     * @protected
     */
    protected checkMinReceiveTokens(): void {
        if (!isGoodBignumber(this.amountNumber)) {
            this.setData({
                minReceiveTokens: '',
                tokenAmount: '',
            })
        }

        if (
            this.token === undefined
            || this.decimals === undefined
            || this.pipeline?.evmTokenDecimals === undefined
        ) {
            return
        }

        const minReceiveTokensNumber = this.amountNumber.shiftedBy(this.amountMinDecimals)
            .minus(this.data.maxTransferFee || 0)
            // .minus(0) // Bridge fee. 0 now

        if (isGoodBignumber(minReceiveTokensNumber)) {
            this.setData({
                // For send int transaction
                minReceiveTokens: minReceiveTokensNumber
                    .dp(this.pipeline.evmTokenDecimals, BigNumber.ROUND_DOWN)
                    .toFixed(),
                // For display in field
                tokenAmount: minReceiveTokensNumber
                    .shiftedBy(-this.amountMinDecimals)
                    .dp(this.pipeline.evmTokenDecimals, BigNumber.ROUND_DOWN)
                    .toFixed(),
            })
        }
    }

    /**
     *
     * @protected
     */
    protected async syncMinReceiveTokens(): Promise<void> {
        if (this.data.pairAddress === undefined || this.token === undefined) {
            return
        }

        try {
            const minReceiveTokens = (await dexPairContract(this.data.pairAddress)
                .methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: unshiftedAmountWithSlippage(
                        this.debt.plus(this.eversAmountNumber),
                        DepositToFactoryMaxSlippage,
                    ).toFixed(),
                    receive_token_root: WEVERRootAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const minReceiveTokensNumber = this.amountNumber
                .shiftedBy(this.token.decimals)
                .minus(minReceiveTokens || 0)
                .dp(0, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(minReceiveTokensNumber)) {
                this.setData('minReceiveTokens', minReceiveTokensNumber.toFixed())
            }
            else {
                this.setData({
                    maxTokenAmount: '',
                    minReceiveTokens: '',
                    tokenAmount: '',
                })
            }
        }
        catch (e) {
            error('Sync min receive tokens amount error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncTokensAmount(): Promise<void> {
        if (this.data.pairAddress === undefined || this.token === undefined || this.decimals === undefined) {
            return
        }

        try {
            const tokensAmount = (await dexPairContract(this.data.pairAddress)
                .methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: unshiftedAmountWithSlippage(
                        this.debt.plus(this.eversAmountNumber),
                        new BigNumber(DepositToFactoryMinSlippageNumerator)
                            .div(DepositToFactoryMinSlippageDenominator)
                            .toFixed(),
                    ).toFixed(),
                    receive_token_root: WEVERRootAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const tokensAmountNumber = this.amountNumber.shiftedBy(this.token.decimals)
                .minus(tokensAmount || 0)

            if (isGoodBignumber(tokensAmountNumber)) {

                this.setData({
                    maxTokenAmount: tokensAmountNumber.toFixed(),
                    tokenAmount: tokensAmountNumber
                        .shiftedBy(-this.token.decimals)
                        .dp(this.token.decimals, BigNumber.ROUND_DOWN)
                        .toFixed(),
                })
            }
            else {
                this.setData({
                    maxTokenAmount: '',
                    tokenAmount: '',
                })
            }
        }
        catch (e) {
            error('Sync tokens amount error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncMaxEversAmount(): Promise<void> {
        if (
            this.data.pairAddress === undefined
            || this.token === undefined
            || this.pipeline?.everscaleTokenAddress === undefined
        ) {
            return
        }

        try {
            const eversAmount = (await dexPairContract(this.data.pairAddress)
                .methods.expectedExchange({
                    answerId: 0,
                    amount: this.amountNumber
                        .shiftedBy(this.token.decimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    spent_token_root: this.pipeline.everscaleTokenAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const eversAmountNumber = new BigNumber(eversAmount || 0)
                .times(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .minus(this.debt.shiftedBy(DexConstants.CoinDecimals))
                .dp(DexConstants.CoinDecimals, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(eversAmountNumber)) {
                this.setData('maxEversAmount', eversAmountNumber.toFixed())
            }
            else {
                this.setData('maxEversAmount', '0')
            }
        }
        catch (e) {
            error('Sync EVERs max amount error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncMinAmount(): Promise<void> {
        if (!this.everWallet.isConnected) {
            this.setData('minAmount', undefined)
            return
        }

        if (
            this.data.pairAddress === undefined
            || this.token === undefined
            || this.decimals === undefined
        ) {
            return
        }

        try {
            const minAmount = (await dexPairContract(this.data.pairAddress)
                .methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt.shiftedBy(DexConstants.CoinDecimals)
                        .plus(this.minEversAmount || 0)
                        .times(100)
                        .div(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: WEVERRootAddress,
                })
                .call({
                    cachedState: toJS(this.data.pairState),
                }))
                .expected_amount

            const minAmountNumber = new BigNumber(minAmount || 0)
                .plus(1)
                .shiftedBy(-this.token.decimals)
                .shiftedBy(this.amountMinDecimals)
                .dp(0, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(minAmountNumber)) {
                this.setData('minAmount', minAmountNumber.toFixed())
            }
            else {
                this.setData('minAmount', '')
            }
        }
        catch (e) {
            error(e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncCreditFactoryFee(): Promise<void> {
        try {
            const { fee } = (await creditFactoryContract(CreditFactoryAddress)
                .methods.getDetails({
                    answerId: 0,
                })
                .call())
                .value0

            this.setData('creditFactoryFee', fee)
        }
        catch (e) {
            this.setData('creditFactoryFee', '')
            error('Sync fee error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncTransferFees(): Promise<void> {
        if (this.data.pairAddress === undefined || this.token === undefined) {
            return
        }

        try {
            const results = await Promise.allSettled([
                dexPairContract(this.data.pairAddress)
                    .methods.expectedSpendAmount({
                        answerId: 0,
                        receive_amount: this.debt
                            .shiftedBy(DexConstants.CoinDecimals)
                            .plus(HiddenBridgeStrategyGas)
                            .times(100)
                            .div(new BigNumber(100).minus(
                                new BigNumber(DepositToFactoryMinSlippageNumerator)
                                    .div(DepositToFactoryMinSlippageDenominator)
                                    .toFixed(),
                            ))
                            .dp(0, BigNumber.ROUND_UP)
                            .toFixed(),
                        receive_token_root: WEVERRootAddress,
                    })
                    .call({
                        cachedState: toJS(this.data.pairState),
                    }),
                dexPairContract(this.data.pairAddress)
                    .methods.expectedSpendAmount({
                        answerId: 0,
                        receive_amount: this.debt
                            .shiftedBy(DexConstants.CoinDecimals)
                            .plus(HiddenBridgeStrategyGas)
                            .times(100)
                            .div(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                            .dp(0, BigNumber.ROUND_UP)
                            .toFixed(),
                        receive_token_root: WEVERRootAddress,
                    })
                    .call({
                        cachedState: toJS(this.data.pairState),
                    }),
            ]).then(r => r.map(i => (i.status === 'fulfilled' ? i.value : undefined)))

            this.setData({
                maxTransferFee: results[1]?.expected_amount,
                minTransferFee: results[0]?.expected_amount,
                minAmount: new BigNumber(results[1]?.expected_amount || 0).plus(1).toFixed(),
            })
            this.checkMinReceiveTokens()
        }
        catch (e) {
            error('Sync transfers fee error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncPair(): Promise<void> {
        if (this.pipeline?.everscaleTokenAddress === undefined) {
            return
        }

        try {
            const pairAddress = await Dex.checkPair(
                WEVERRootAddress,
                this.pipeline.everscaleTokenAddress,
            )

            if (pairAddress === undefined) {
                return
            }

            const pairState = (await getFullContractState(pairAddress))

            debug('Sync pair successfully')

            this.setData({
                pairAddress,
                pairState,
            })
        }
        catch (e) {
            error('Sync pair error', e)
        }
    }

    /**
     * Reset data and state to their defaults
     * @protected
     */
    protected reset(): void {
        this.setData(() => DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA)
        this.setState(() => DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE)
    }


    /*
     * Memoized store data values
     * ----------------------------------------------------------------------------------
     */

    public get amount(): CrosschainBridgeStoreData['amount'] {
        return this.data.amount
    }

    public get maxTokenAmount(): CrosschainBridgeStoreData['maxTokenAmount'] {
        return this.data.maxTokenAmount
    }

    public get maxEversAmount(): CrosschainBridgeStoreData['maxEversAmount'] {
        return this.data.maxEversAmount
    }

    public get maxTransferFee(): CrosschainBridgeStoreData['maxTransferFee'] {
        return this.data.maxTransferFee
    }

    /**
     * Returns non-shifted minimum amount to spend
     */
    public get minAmount(): CrosschainBridgeStoreData['minAmount'] {
        return this.pendingWithdrawalsMinAmount ?? this.data.minAmount
    }

    /**
     * Returns non-shifted minimum receive EVER`s amount
     */
    public get minEversAmount(): CrosschainBridgeStoreData['minEversAmount'] {
        return this.data.minEversAmount
    }

    public get minTransferFee(): CrosschainBridgeStoreData['minTransferFee'] {
        return this.data.minTransferFee
    }

    /**
     * Returns non-shifted receive tokens amount
     */
    public get tokenAmount(): CrosschainBridgeStoreData['tokenAmount'] {
        return this.data.tokenAmount
    }

    /**
     * Returns non-shifted receive EVER`s amount
     */
    public get eversAmount(): CrosschainBridgeStoreData['eversAmount'] {
        return this.data.eversAmount
    }

    public get depositType(): CrosschainBridgeStoreData['depositType'] {
        return this.data.depositType
    }

    public get minReceiveTokens(): CrosschainBridgeStoreData['minReceiveTokens'] {
        return this.data.minReceiveTokens
    }

    public get leftAddress(): CrosschainBridgeStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): CrosschainBridgeStoreData['leftNetwork'] {
        return this.data.leftNetwork
    }

    public get pipeline(): CrosschainBridgeStoreData['pipeline'] {
        return this.data.pipeline
    }

    public get hiddenBridgePipeline(): CrosschainBridgeStoreData['hiddenBridgePipeline'] {
        return this.data.hiddenBridgePipeline
    }

    public get rightAddress(): CrosschainBridgeStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get rightNetwork(): CrosschainBridgeStoreData['rightNetwork'] {
        return this.data.rightNetwork
    }

    public get txHash(): CrosschainBridgeStoreData['txHash'] {
        return this.data.txHash
    }


    /*
     * Memoized store state values
     * ----------------------------------------------------------------------------------
     */

    public get approvalStrategy(): CrosschainBridgeStoreState['approvalStrategy'] {
        return this.state.approvalStrategy
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

    public get isPendingAllowance(): CrosschainBridgeStoreState['isPendingAllowance'] {
        return this.state.isPendingAllowance
    }

    public get isPendingApproval(): CrosschainBridgeStoreState['isPendingApproval'] {
        return this.state.isPendingApproval
    }

    public get isTokenChainSameToTargetChain(): CrosschainBridgeStoreState['isTokenChainSameToTargetChain'] {
        return this.state.isTokenChainSameToTargetChain
    }

    public get step(): CrosschainBridgeStoreState['step'] {
        return this.state.step
    }

    public get evmPendingWithdrawal(): CrosschainBridgeStoreState['evmPendingWithdrawal'] {
        return this.state.evmPendingWithdrawal
    }

    /*
     * Computed states and values
     * ----------------------------------------------------------------------------------
     */

    /**
     * Returns non-shifted amount field BigNumber instance
     */
    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
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
            return this.pipeline?.evmTokenBalance
        }
        return this.token?.balance
    }

    /**
     * Returns shifted token balance BigNumber instance
     */
    public get balanceNumber(): BigNumber {
        return new BigNumber(this.balance || 0).shiftedBy(this.decimals ? -this.decimals : 0)
    }

    /**
     * Returns token decimals from EVM token vault for `EVM to` direction.
     * Otherwise, Everscale token decimals
     */
    public get decimals(): number | undefined {
        if (this.isFromEvm || isEvmAddressValid(this.token?.root)) {
            return this.pipeline?.evmTokenDecimals
        }
        return this.token?.decimals
    }

    /**
     * Returns non-shifted min amount BigNumber instance
     */
    public get minAmountNumber(): BigNumber {
        return new BigNumber(this.minAmount || 0)
    }

    /**
     * Returns non-shifted min receive tokens BigNumber instance
     */
    public get minReceiveTokensNumber(): BigNumber {
        return new BigNumber(this.minReceiveTokens || 0)
    }

    public get depositFee(): string {
        if (this.pipeline?.isMultiVault && this.isFromEvm) {
            return this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals || 0)
                .times(this.pipeline?.depositFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.pipeline.evmTokenDecimals || 0))
                .toFixed()
        }
        return '0'
    }

    public get withdrawFee(): string {
        if (this.pipeline?.isMultiVault && this.isFromEverscale) {
            return this.amountNumber.shiftedBy(this.token?.decimals || 0)
                .times(this.pipeline?.withdrawFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.token?.decimals || 0))
                .toFixed()
        }
        return '0'
    }

    public get isAmountVaultLimitExceed(): boolean {
        return isGoodBignumber(this.vaultLimitNumber) && !validateMaxValue(
            this.vaultLimitNumber.shiftedBy(-this.amountMinDecimals).toFixed(),
            this.amountNumber.toFixed(),
        )
    }

    public get isAmountMinValueValid(): boolean {
        if (this.amount.length > 0 && isGoodBignumber(this.amountNumber)) {
            return validateMinValue(
                this.minAmountNumber.shiftedBy(-this.amountMinDecimals).toFixed(),
                this.amountNumber.toFixed(),
            )
        }
        return true
    }

    public get isAmountMaxValueValid(): boolean {
        if (this.amount.length > 0 && isGoodBignumber(this.amountNumber)) {
            return validateMaxValue(
                this.balanceNumber.toFixed(),
                this.amountNumber.toFixed(),
            )
        }
        return true
    }

    public get isAmountValid(): boolean {
        if (this.amount.length === 0) {
            return true
        }

        return (
            this.isAmountMinValueValid
            && this.isAmountMaxValueValid
            && (this.isEvmToEverscale ? !this.isAmountVaultLimitExceed : true)
        )
    }

    public get isTokensAmountValid(): boolean {
        if (this.tokenAmount && this.tokenAmount.length > 0 && isGoodBignumber(this.tokenAmountNumber, false)) {
            return (
                validateMinValue('0', this.tokenAmount, this.token?.decimals)
                && validateMaxValue(this.maxTokenAmount, this.tokenAmount, this.token?.decimals)
            )
        }
        return isGoodBignumber(this.tokenAmountNumber, false)
    }

    public get isEversAmountValid(): boolean {
        if (this.isInsufficientEverBalance) {
            return (
                validateMinValue(this.minEversAmount, this.eversAmount, DexConstants.CoinDecimals)
                && validateMaxValue(this.maxEversAmount, this.eversAmount, DexConstants.CoinDecimals)
            )
        }
        if (this.eversAmount && this.eversAmount.length > 0 && isGoodBignumber(this.eversAmountNumber)) {
            return (
                validateMinValue('0', this.eversAmount, DexConstants.CoinDecimals)
                && validateMaxValue(this.maxEversAmount, this.eversAmount, DexConstants.CoinDecimals)
            )
        }
        return isGoodBignumber(this.eversAmountNumber, false)
    }

    public get isAssetValid(): boolean {
        return (
            this.evmWallet.isConnected
            && this.everWallet.isConnected
            && this.data.selectedToken !== undefined
            && this.amount.length > 0
            && isGoodBignumber(this.amountNumber)
            && (this.pipeline?.isMultiVault ? !this.pipeline?.isBlacklisted : true)
            && (this.isSwapEnabled
                ? (this.isAmountValid && this.isTokensAmountValid && this.isEversAmountValid)
                : this.isAmountValid)
        )
    }

    public get isRouteValid(): boolean {
        let isValid = (
            this.everWallet.isConnected
            && this.evmWallet.isConnected
            && this.leftNetwork !== undefined
            && this.leftAddress.length > 0
            && this.rightNetwork !== undefined
            && this.rightAddress.length > 0
            && this.bridgeAssets.isReady
        )

        if (this.isFromEvm) {
            isValid = (
                isValid
                && isEqual(this.leftNetwork?.chainId, this.evmWallet.chainId)
                && isEvmAddressValid(this.leftAddress)
            )
        }

        if (this.isEvmToEvm) {
            isValid = isValid && isEvmAddressValid(this.rightAddress)
        }
        else if (this.isEvmToEverscale) {
            isValid = isValid && isEverscaleAddressValid(this.rightAddress)
        }
        else if (this.isEverscaleToEvm) {
            isValid = (
                isValid
                && isEqual(this.rightNetwork?.chainId, this.evmWallet.chainId)
                && isEverscaleAddressValid(this.leftAddress)
                && isEvmAddressValid(this.rightAddress)
            )
        }

        return isValid
    }

    public get isCreditAvailable(): boolean {
        if (this.token?.root === undefined || this.leftNetwork?.chainId === undefined) {
            return false
        }
        return this.bridgeAssets.isCreditAvailable(this.token.root, this.leftNetwork.chainId)
    }

    public get isSwapEnabled(): boolean {
        return this.depositType === 'credit'
    }

    public get isInsufficientEverBalance(): boolean {
        return new BigNumber(this.everWallet.balance || 0).lt(EmptyWalletMinEversAmount)
    }

    public get isInsufficientVaultBalance(): boolean {
        if (this.isEvmToEvm) {
            return new BigNumber(this.hiddenBridgePipeline?.vaultBalance ?? 0)
                .shiftedBy(-(this.hiddenBridgePipeline?.evmTokenDecimals ?? 0))
                .lt(this.amountNumber)
        }
        return new BigNumber(this.pipeline?.vaultBalance ?? 0)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals ?? 0))
            .lt(this.amountNumber)
    }

    public get evmTokenDecimals(): number | undefined {
        if (this.isFromEverscale && this.pipeline?.isMultiVault && !this.pipeline.isNative) {
            return this.token?.decimals
        }
        return this.isEvmToEvm ? this.hiddenBridgePipeline?.evmTokenDecimals : this.pipeline?.evmTokenDecimals
    }

    public get isEverscaleBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'everscale'
    }

    public get isEvmToEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isEvmToEverscale(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'everscale'
    }

    public get isFromEvm(): boolean {
        return this.leftNetwork?.type === 'evm'
    }

    public get isFromEverscale(): boolean {
        return this.leftNetwork?.type === 'everscale'
    }

    public get isEverscaleToEvm(): boolean {
        return this.leftNetwork?.type === 'everscale' && this.rightNetwork?.type === 'evm'
    }

    public get rightNetworks(): NetworkShape[] {
        if (process.env.NODE_ENV !== 'production') {
            return networks
        }
        return networks.filter(
            network => network.id !== this.leftNetwork?.id,
        )
    }

    public get token(): BridgeAsset | undefined {
        if (
            this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.data.selectedToken === undefined
        ) {
            return undefined
        }

        return this.bridgeAssets.get(this.leftNetwork.type, this.leftNetwork.chainId, this.data.selectedToken)
    }

    public get vaultBalance(): string | undefined {
        if (this.isEvmToEvm) {
            return this.hiddenBridgePipeline?.vaultBalance
        }
        return this.pipeline?.vaultBalance
    }

    public get vaultBalanceDecimals(): number | undefined {
        if (this.isEvmToEvm) {
            return this.hiddenBridgePipeline?.evmTokenDecimals
        }
        return this.pipeline?.evmTokenDecimals
    }

    public get vaultLimitNumber(): BigNumber {
        return new BigNumber(this.pipeline?.vaultLimit || 0)
            .shiftedBy(this.pipeline?.evmTokenDecimals === undefined ? 0 : -this.pipeline.evmTokenDecimals)
            .shiftedBy(this.amountMinDecimals)
            .dp(0, BigNumber.ROUND_DOWN)
    }

    public get tokens(): BridgeAsset[] {
        const leftChainId = this.leftNetwork?.chainId
        const rightChainId = this.rightNetwork?.chainId

        if (this.isEvmToEvm && leftChainId !== undefined && rightChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => {
                    const assetRoot = this.bridgeAssets.findAssetRootByTokenAndChain(token.root, leftChainId)
                    const assets = this.bridgeAssets.assets[assetRoot ?? token.root]
                    return (
                        isEvmAddressValid(token.root)
                        && token.chainId === leftChainId
                        && Object.entries({ ...assets }).some(([key, asset]) => {
                            const [tokenBase] = key.split('_')
                            return (
                                asset.vaults.some(vault => (
                                    vault.chainId === leftChainId
                                    && vault.depositType === 'credit'
                                    && tokenBase === 'evm'
                                ))
                            )
                        })
                        && Object.entries({ ...assets }).some(([key, asset]) => {
                            const [tokenBase] = key.split('_')
                            return (
                                asset.vaults.some(vault => (
                                    vault.chainId === rightChainId
                                    && vault.depositType === 'default'
                                    && tokenBase === 'evm'
                                ))
                            )
                        })
                    )
                },
            )
        }

        if (this.isFromEvm && leftChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => isEvmAddressValid(token.root) && token.chainId === leftChainId,
            )
        }

        if (this.isFromEverscale && leftChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => isEverscaleAddressValid(token.root) && token.chainId === leftChainId,
            )
        }

        return this.bridgeAssets.tokens
    }

    public get tokenAmountNumber(): BigNumber {
        return new BigNumber(this.tokenAmount || 0)
    }

    public get eversAmountNumber(): BigNumber {
        return new BigNumber(this.eversAmount || 0)
    }

    protected get debt(): BigNumber {
        return new BigNumber(CreditBody)
            .plus(new BigNumber(this.data.creditFactoryFee || 0))
            .shiftedBy(-DexConstants.CoinDecimals)
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useBridgeAssets(): BridgeAssetsService {
        return this.bridgeAssets
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

    public get pendingWithdrawalsAmount(): string | undefined {
        return this.pendingWithdrawals
            ?.reduce((acc, item) => acc.plus(item.amount), new BigNumber(0))
            .toFixed()
    }

    public get pendingWithdrawalsBounty(): string | undefined {
        return this.pendingWithdrawals
            ?.reduce((acc, item) => acc.plus(item.bounty), new BigNumber(0))
            .toFixed()
    }

    public get pendingWithdrawalsMinAmount(): string | undefined {
        if (!this.pendingWithdrawalsAmount || !this.evmTokenDecimals) {
            return undefined
        }
        return new BigNumber(this.pendingWithdrawalsAmount)
            .shiftedBy(-this.evmTokenDecimals)
            .shiftedBy(this.amountMinDecimals)
            .dp(0, BigNumber.ROUND_DOWN)
            .toFixed()
    }

    #everWalletBalanceDisposer: IReactionDisposer | undefined

    #everWalletDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #swapDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}
