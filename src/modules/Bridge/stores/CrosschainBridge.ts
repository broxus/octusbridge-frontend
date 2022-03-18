import BigNumber from 'bignumber.js'
import isEqual from 'lodash.isequal'
import {
    action,
    computed,
    IReactionDisposer,
    makeObservable,
    observable,
    reaction,
    toJS,
} from 'mobx'
import { Address, Contract } from 'everscale-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'

import rpc from '@/hooks/useRpcClient'
import {
    BridgeConstants,
    Dex,
    DexAbi,
    DexConstants,
    TokenAbi,
} from '@/misc'
import {
    DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA,
    DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE,
    EMPTY_WALLET_MIN_TONS_AMOUNT,
} from '@/modules/Bridge/constants'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    NetworkFields,
} from '@/modules/Bridge/types'
import { getCreditFactoryContract, unshiftedAmountWithSlippage } from '@/modules/Bridge/utils'
import { BaseStore } from '@/stores/BaseStore'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { Pipeline, TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import {
    debug,
    error,
    getEverscaleMainNetwork,
    getLabeledNetworks,
    isEvmAddressValid,
    isGoodBignumber,
    isTonAddressValid,
    log,
    throwException,
    validateMaxValue,
    validateMinValue,
} from '@/utils'
import { LabeledNetwork } from '@/types'
import { EverWalletService } from '@/stores/EverWalletService'


export class CrosschainBridge extends BaseStore<CrosschainBridgeStoreData, CrosschainBridgeStoreState> {

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly tokensCache: TokensCacheService,
    ) {
        super()

        this.reset()

        makeObservable<
            CrosschainBridge,
            | 'data'
            | 'state'
            | 'debt'
            | 'pairContract'
            | 'vaultContract'
            | 'handleChangeToken'
            | 'handleEvmWalletConnection'
            | 'handleEverWalletConnection'
            | 'handleEverWalletBalance'
        >(this, {
            data: observable,
            state: observable,
            handleChangeToken: action.bound,
            handleEvmWalletConnection: action.bound,
            handleEverWalletConnection: action.bound,
            handleEverWalletBalance: action.bound,
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
            vaultLimit: computed,
            vaultLimitNumber: computed,
            tokens: computed,
            tokenAmountNumber: computed,
            eversAmountNumber: computed,
            debt: computed,
            pairContract: computed,
            vaultContract: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useTokensCache: computed,
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
            () => [this.everWallet.balance, this.everWallet.isUpdatingContract],
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
                || this.token === undefined
                || this.leftNetwork === undefined
                || this.rightNetwork === undefined
                || this.pipeline?.evmTokenDecimals === undefined
            ) {
                return
            }

            this.setState('isPendingApproval', true)

            const evmTokenContract = await this.tokensCache.getEvmTokenContract(this.pipeline)

            if (evmTokenContract === undefined) {
                this.setState('isPendingApproval', false)
                return
            }

            try {
                tries += 1

                if (this.approvalStrategy === 'infinity') {
                    await evmTokenContract.methods.approve(
                        this.pipeline.vault,
                        '340282366920938463426481119284349108225',
                    ).send({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                }
                else {
                    await evmTokenContract.methods.approve(
                        this.pipeline.vault,
                        this.amountNumber
                            .shiftedBy(this.pipeline.evmTokenDecimals)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed(),
                    ).send({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                }

                this.setState('step', CrosschainBridgeStep.TRANSFER)
            }
            catch (e: any) {
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
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
            || this.pipeline?.evmTokenDecimals === undefined
        ) {
            return
        }

        const evmTokenContract = await this.tokensCache.getEvmTokenContract(this.pipeline)

        if (evmTokenContract === undefined) {
            return
        }

        this.setState('isPendingAllowance', true)

        try {
            const allowance = await evmTokenContract.methods.allowance(
                this.evmWallet.address,
                this.pipeline.vault,
            ).call()

            const approvalDelta = new BigNumber(allowance).minus(
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
     * Common transfer tokens from EVM to Everscale.
     * @param {() => void} reject
     */
    public async transfer(reject?: () => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
                || this.vaultContract === undefined
            ) {
                return
            }

            const target = this.rightAddress.split(':')

            this.setState('isProcessing', true)

            try {
                tries += 1

                await this.vaultContract.methods.deposit(
                    [target[0], `0x${target[1]}`],
                    this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                }).once('transactionHash', (transactionHash: string) => {
                    this.setData('txHash', transactionHash)
                })
            }
            catch (e: any) {
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
                    error('Transfer deposit error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.()
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
    public async transferWithSwap(reject?: () => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.token === undefined
                || this.pipeline?.evmTokenDecimals === undefined
                || this.vaultContract === undefined
            ) {
                return
            }

            const target = this.rightAddress.split(':')
            const creditFactoryTarget = BridgeConstants.CreditFactoryAddress.toString().split(':')

            this.setState('isProcessing', true)

            try {
                tries += 1

                await this.vaultContract.methods.depositToFactory(
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
                    BridgeConstants.DepositToFactoryMinSlippageNumerator,
                    BridgeConstants.DepositToFactoryMinSlippageDenominator,
                    `0x${Buffer.from('te6ccgEBAQEAAgAAAA==', 'base64').toString('hex')}`,
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                }).once('transactionHash', (transactionHash: string) => {
                    this.setData('txHash', transactionHash)
                })
            }
            catch (e: any) {
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
                    error('Transfer deposit to factory error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.()
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
    public async transferWithHiddenSwap(reject?: () => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.everWallet.address === undefined
                || this.token === undefined
                || this.rightNetwork === undefined
                || this.pipeline?.evmTokenDecimals === undefined
                || this.pipeline?.proxy === undefined
                || this.vaultContract === undefined
            ) {
                return
            }

            const target = this.everWallet.address.split(':')
            const creditFactoryTarget = BridgeConstants.CreditFactoryAddress.toString().split(':')
            const hiddenBridgeFactoryContract = new rpc.Contract(
                TokenAbi.HiddenBridgeStrategyFactory,
                BridgeConstants.HiddenBridgeStrategyFactory,
            )

            this.setState('isProcessing', true)

            try {
                tries += 1

                const recipient = (await hiddenBridgeFactoryContract.methods.getStrategyAddress({
                    answerId: 0,
                    tokenRoot: new Address(this.token.root),
                }).call()).value0

                const hiddenBridgeStrategyContract = new rpc.Contract(
                    TokenAbi.HiddenBridgeStrategy,
                    recipient,
                )

                const processingId = new BigNumber(
                    Math.floor(
                        Math.random() * (Number.MAX_SAFE_INTEGER - 1),
                    ) + 1,
                ).toFixed()

                const payload = (await hiddenBridgeStrategyContract.methods.buildLayer3({
                    chainId: this.rightNetwork.chainId,
                    evmAddress: this.rightAddress,
                    id: processingId,
                    proxy: new Address(this.pipeline.proxy),
                }).call()).value0

                await this.vaultContract.methods.depositToFactory(
                    this.amountNumber.shiftedBy(this.pipeline.evmTokenDecimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    '0',
                    `0x${target[1]}`,
                    `0x${creditFactoryTarget[1]}`,
                    `0x${recipient.toString().split(':')[1]}`,
                    this.minReceiveTokensNumber.toFixed(),
                    BridgeConstants.HiddenBridgeStrategyGas,
                    this.data.swapType,
                    BridgeConstants.DepositToFactoryMinSlippageNumerator,
                    BridgeConstants.DepositToFactoryMinSlippageDenominator,
                    `0x${Buffer.from(payload, 'base64').toString('hex')}`,
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                }).once('transactionHash', (transactionHash: string) => {
                    this.setData('txHash', transactionHash)
                })
            }
            catch (e: any) {
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
                    error('Transfer deposit to factory error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.()
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
    public async prepareEverscaleToEvm(reject?: () => void): Promise<void> {
        if (
            this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.proxy === undefined
            || this.everWallet.address === undefined
        ) {
            return
        }

        this.setState('isProcessing', true)

        const proxyContract = new rpc.Contract(TokenAbi.EverscaleTokenTransferProxy, new Address(this.pipeline.proxy))

        this.pipeline.everscaleConfiguration = (await proxyContract.methods.getDetails({
            answerId: 0,
        }).call())._config.tonConfiguration

        if (this.pipeline.everscaleConfiguration === undefined) {
            this.setState('isProcessing', false)
            return
        }

        const everscaleConfigurationContract = new rpc.Contract(
            TokenAbi.EverscaleEventConfig,
            this.pipeline.everscaleConfiguration,
        )

        const everscaleConfigurationState = (await rpc.getFullContractState({
            address: everscaleConfigurationContract.address,
        })).state

        const subscriber = new rpc.Subscriber()

        try {
            const oldStream = subscriber.oldTransactions(
                everscaleConfigurationContract.address,
                {
                    fromLt: everscaleConfigurationState?.lastTransactionId?.lt,
                },
            )
            const eventStream = oldStream.merge(subscriber.transactions(
                everscaleConfigurationContract.address,
            )).flatMap(item => item.transactions).filterMap(async tx => {
                const decodedTx = await everscaleConfigurationContract.decodeTransaction({
                    methods: ['deployEvent'],
                    transaction: tx,
                })

                if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                    const { eventData } = decodedTx.input.eventVoteData
                    const event = await rpc.unpackFromCell({
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
                        const eventAddress = await everscaleConfigurationContract.methods.deriveEventAddress({
                            answerId: 0,
                            eventVoteData: decodedTx.input.eventVoteData,
                        }).call()

                        return eventAddress.eventContract
                    }
                    return undefined
                }
                return undefined
            })

            const walletContract = await this.tokensCache.getEverscaleTokenWalletContract(this.token.root)

            if (walletContract === undefined) {
                throwException('Cannot define token wallet contract.')
                return
            }

            const data = await rpc.packIntoCell({
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
                await walletContract.methods.transfer({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    deployWalletValue: '200000000',
                    notify: true,
                    payload: data.boc,
                    recipient: new Address(this.pipeline.proxy),
                    remainingGasTo: new Address(this.everWallet.address),
                }).send({
                    amount: '6000000000',
                    bounce: true,
                    from: new Address(this.leftAddress),
                })
            }
            else {
                debug('Burn EVM-based token to proxy')
                await walletContract.methods.burn({
                    callbackTo: new Address(this.pipeline.proxy),
                    payload: data.boc,
                    remainingGasTo: new Address(this.everWallet.address),
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                }).send({
                    amount: '6000000000',
                    bounce: true,
                    from: new Address(this.leftAddress),
                })
            }

            const eventAddress = await eventStream.first()

            this.setData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.()
            error('Prepare Everscale to EVM error', e)
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
                        ? EMPTY_WALLET_MIN_TONS_AMOUNT.toFixed()
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
            || this.pairContract === undefined
            || this.token === undefined
            || this.decimals === undefined
        ) {
            return
        }

        try {
            this.setState('isCalculating', true)

            const {
                expected_amount: maxTotalEversAmount,
            } = await this.pairContract.methods.expectedExchange({
                answerId: 0,
                amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const maxEversAmountBN = new BigNumber(maxTotalEversAmount || 0)
                .times(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
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

                if (isGoodBignumber(maxEversAmountBN)) {
                    data.eversAmount = maxEversAmountBN.toFixed()
                }

                this.setData(data)
            }
            else {
                const minSpentTokensNumber = this.amountNumber.minus(this.tokenAmountNumber)

                const {
                    expected_amount: toExchangeAmount,
                } = await this.pairContract.methods.expectedExchange({
                    answerId: 0,
                    amount: minSpentTokensNumber
                        .shiftedBy(this.token.decimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    spent_token_root: new Address(this.token.root),
                }).call({
                    cachedState: toJS(this.data.pairState),
                })

                const eversAmountBN = new BigNumber(toExchangeAmount || 0)
                    .times(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMinSlippage))
                    .div(100)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .shiftedBy(-DexConstants.CoinDecimals)
                    .minus(this.debt)
                    .dp(DexConstants.CoinDecimals, BigNumber.ROUND_DOWN)

                this.setData('swapType', '0')

                const {
                    expected_amount: maxSpendTokens,
                } = await this.pairContract.methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .plus(eversAmountBN)
                        .times(100)
                        .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                        .shiftedBy(DexConstants.CoinDecimals)
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call({
                    cachedState: toJS(this.data.pairState),
                })

                const minTokensAmountBN = this.amountNumber.shiftedBy(this.token.decimals).minus(maxSpendTokens)

                if (isGoodBignumber(minTokensAmountBN)) {
                    this.setData('minReceiveTokens', minTokensAmountBN.toFixed())

                    if (isGoodBignumber(eversAmountBN) || eversAmountBN.isZero()) {
                        this.setData('eversAmount', eversAmountBN.toFixed())
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

                    if (isGoodBignumber(maxEversAmountBN)) {
                        this.setData('eversAmount', maxEversAmountBN.toFixed())
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
    public async onChangeTonsAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.pairContract === undefined
            || this.decimals === undefined
            || this.token === undefined
        ) {
            return
        }

        try {
            this.setState('isCalculating', true)

            const {
                expected_amount: maxSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: this.debt
                    .plus(this.eversAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                    .shiftedBy(DexConstants.CoinDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const minTokensAmountBN = this.amountNumber.shiftedBy(this.amountMinDecimals).minus(maxSpendTokens || 0)

            if (isGoodBignumber(minTokensAmountBN)) {
                this.setData({
                    minReceiveTokens: minTokensAmountBN.toFixed(),
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

            const {
                expected_amount: minSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: this.debt
                    .plus(this.eversAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMinSlippage))
                    .shiftedBy(DexConstants.CoinDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const tokensAmountBN = this.amountNumber
                .shiftedBy(this.amountMinDecimals)
                .minus(minSpendTokens || 0)
                .shiftedBy(-this.token.decimals)

            if (isGoodBignumber(tokensAmountBN)) {
                this.setData({
                    swapType: '0',
                    tokenAmount: tokensAmountBN.toFixed(),
                })
            }
        }
        catch (e) {
            error('Change tons amount recalculate error', e)
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
        if (!this.isSwapEnabled) {
            this.setData({
                eversAmount: '',
                minAmount: '',
                tokenAmount: '',
            })
            return
        }

        this.checkSwapCredit()
        this.checkMinEvers()

        await this.syncToken()

        if (isGoodBignumber(this.amountNumber)) {
            await this.onChangeAmount()
        }
    }

    /**
     *
     */
    public resetAsset(): void {
        this.setData({
            amount: '',
            bridgeFee: undefined,
            depositType: this.isEvmToEvm ? 'credit' : 'default',
            maxTokenAmount: undefined,
            maxEversAmount: undefined,
            minAmount: undefined,
            minTransferFee: undefined,
            minReceiveTokens: undefined,
            minEversAmount: undefined,
            tokenAmount: undefined,
            eversAmount: undefined,
            pairAddress: undefined,
            pairState: undefined,
        })
        this.setState({
            isCalculating: false,
            isFetching: false,
            isLocked: false,
            isPendingAllowance: false,
        })
    }


    /*
     * Reactions handlers
     * ----------------------------------------------------------------------------------
     */

    /**
     *
     * @param selectedToken
     * @protected
     */
    protected async handleChangeToken(selectedToken?: string): Promise<void> {
        debug('handleChangeToken', selectedToken)

        if (selectedToken === undefined) {
            return
        }

        this.resetAsset()

        try {
            this.setState('isFetching', true)

            if (this.isFromEvm && this.isCreditAvailable) {
                if (this.isEvmToEvm) {
                    await Promise.all([
                        this.syncToken(),
                        this.everWallet.isConnected ? this.syncPair() : undefined,
                        this.syncCreditFactoryFee(),
                    ])
                    await this.syncTransferFees()
                    return
                }

                this.checkSwapCredit()
                this.checkMinEvers()

                await this.syncToken()
                await this.syncCreditFactoryFee()

                if (this.everWallet.isConnected) {
                    await this.syncPair()
                    if (this.isSwapEnabled) {
                        await this.syncMinAmount()
                    }
                }
            }
            else {
                await this.syncToken()
            }
        }
        catch (e) {}
        finally {
            this.setState('isFetching', false)
            debug(
                'Suggested pipelines',
                toJS(this.tokensCache.pipelines.filter(
                    pl => pl.everscaleTokenRoot === selectedToken,
                ).map(pl => toJS(pl))),
            )
            debug('Current pipeline', toJS(this.pipeline))
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
            if (this.leftNetwork?.type === 'evm' && !this.leftAddress) {
                this.setData('leftAddress', this.evmWallet.address || '')
            }
            if (this.rightNetwork?.type === 'evm' && !this.rightAddress) {
                this.setData('rightAddress', this.evmWallet.address || '')
            }
        }
        // else if (this.leftNetwork?.type === 'evm') {
        //     this.setData('amount', '')
        //     this.setData('leftAddress', '')
        //     this.setData('leftNetwork', undefined)
        //     this.setData('selectedToken', undefined)
        //     this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        // }
        // else if (this.rightNetwork?.type === 'evm') {
        //     this.setData('rightAddress', '')
        //     this.setData('rightNetwork', undefined)
        // }
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
                    rightAddress: this.everWallet.address || '',
                    rightNetwork: everscaleNetwork,
                })
            }
            else if (this.isFromEverscale && !this.leftAddress) {
                this.setData({
                    leftAddress: this.everWallet.address || '',
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
        if (this.isInsufficientEverBalance && this.isSwapEnabled && !this.everWallet.isUpdatingContract) {
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
        if (this.everWallet.isConnected && !this.everWallet.isUpdatingContract && this.isInsufficientEverBalance) {
            if (this.step === CrosschainBridgeStep.SELECT_ASSET) {
                this.setData({
                    depositType: this.isCreditAvailable ? 'credit' : this.depositType,
                    minEversAmount: BridgeConstants.EmptyWalletMinTonsAmount,
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
        if (this.pairContract === undefined || this.token === undefined) {
            return
        }

        try {
            const minReceiveTokens = (await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: unshiftedAmountWithSlippage(
                    this.debt.plus(this.eversAmountNumber),
                    BridgeConstants.DepositToFactoryMaxSlippage,
                ).toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })).expected_amount

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
        if (this.pairContract === undefined || this.token === undefined || this.decimals === undefined) {
            return
        }

        try {
            const tokensAmount = (await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: unshiftedAmountWithSlippage(
                    this.debt.plus(this.eversAmountNumber),
                    BridgeConstants.DepositToFactoryMinSlippage,
                ).toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })).expected_amount

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
        if (this.pairContract === undefined || this.token === undefined) {
            return
        }

        try {
            const eversAmount = (await this.pairContract.methods.expectedExchange({
                answerId: 0,
                amount: this.amountNumber
                    .shiftedBy(this.token.decimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call({
                cachedState: toJS(this.data.pairState),
            })).expected_amount

            const tonsAmountNumber = new BigNumber(eversAmount || 0)
                .times(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .minus(this.debt.shiftedBy(DexConstants.CoinDecimals))
                .dp(DexConstants.CoinDecimals, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(tonsAmountNumber)) {
                this.setData('maxEversAmount', tonsAmountNumber.toFixed())
            }
            else {
                this.setData('maxEversAmount', '0')
            }
        }
        catch (e) {
            error('Sync TONs max amount error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncMinAmount(): Promise<void> {
        if (
            this.data.pairAddress === undefined
            || this.pairContract === undefined
            || this.token === undefined
            || this.decimals === undefined
        ) {
            return
        }

        try {
            const minAmount = (await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: this.debt.shiftedBy(DexConstants.CoinDecimals)
                    .plus(this.minEversAmount || 0)
                    .times(100)
                    .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })).expected_amount

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
        const creditFactory = getCreditFactoryContract()
        try {
            const { fee } = (await creditFactory.methods.getDetails({
                answerId: 0,
            }).call()).value0

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
        if (this.pairContract === undefined || this.token === undefined) {
            return
        }

        try {
            const results = await Promise.allSettled([
                this.pairContract.methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .shiftedBy(DexConstants.CoinDecimals)
                        .plus(BridgeConstants.HiddenBridgeStrategyGas)
                        .times(100)
                        .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMinSlippage))
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call({
                    cachedState: toJS(this.data.pairState),
                }),
                this.pairContract.methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .shiftedBy(DexConstants.CoinDecimals)
                        .plus(BridgeConstants.HiddenBridgeStrategyGas)
                        .times(100)
                        .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call({
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
        if (this.token?.root === undefined) {
            return
        }

        try {
            const pairAddress = await Dex.checkPair(
                DexConstants.WTONRootAddress,
                new Address(this.token.root),
            )

            if (pairAddress === undefined) {
                return
            }

            const pairState = (await rpc.getFullContractState({
                address: pairAddress,
            })).state

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
     *
     * @protected
     */
    protected async syncToken(): Promise<void> {
        if (this.token === undefined) {
            return
        }

        try {
            if (this.leftNetwork?.type === 'everscale') {
                await this.tokensCache.syncEverscaleToken(this.token.root)
                debug('Sync TON token')
            }

            if (this.leftNetwork?.type === 'evm') {
                debug('Sync EVM token by left network', this.depositType)
                await this.tokensCache.syncEvmToken(this.pipeline)
            }

            if (this.rightNetwork?.type === 'evm') {
                debug('Sync EVM token by right network', this.depositType)
                await this.tokensCache.syncEvmToken(this.pipeline)
            }
        }
        catch (e) {
            this.setState('isLocked', true)
            error('Sync token error', e)
        }
    }

    /**
     * Reset data and state to their defaults
     * @protected
     */
    protected reset(): void {
        this.setData(DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA)
        this.setState(DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE)
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
        return this.data.minAmount
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

    public get pipeline(): Pipeline | undefined {
        if (
            this.token?.root === undefined
            || this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.rightNetwork?.type === undefined
            || this.rightNetwork?.chainId === undefined
        ) {
            return undefined
        }

        const everscaleMainNetwork = getEverscaleMainNetwork()

        return this.tokensCache.pipeline(
            this.token.root,
            `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
            this.isEvmToEvm
                ? `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`
                : `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            this.depositType,
        )
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

    public get step(): CrosschainBridgeStoreState['step'] {
        return this.state.step
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
     * Returns min value of decomals between TON token and EVM token vault decimals
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
        if (this.isFromEvm) {
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
        if (this.isFromEvm) {
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

        if (this.isEvmToEvm || (this.isSwapEnabled && isGoodBignumber(this.amountNumber))) {
            return (
                this.isAmountMinValueValid
                && this.isAmountMaxValueValid
            ) && (this.isEvmToEverscale ? !this.isAmountVaultLimitExceed : true)
        }

        return this.isAmountMaxValueValid && (
            this.isEvmToEverscale ? !this.isAmountVaultLimitExceed : true
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
            isValid = isValid && isTonAddressValid(this.rightAddress)
        }
        else if (this.isEverscaleToEvm) {
            isValid = (
                isValid
                && isEqual(this.rightNetwork?.chainId, this.evmWallet.chainId)
                && isTonAddressValid(this.leftAddress)
                && isEvmAddressValid(this.rightAddress)
            )
        }

        return isValid
    }

    public get isCreditAvailable(): boolean {
        if (this.token === undefined) {
            return false
        }

        return this.tokensCache.pipelines?.some(
            pipeline => (
                pipeline.everscaleTokenRoot === this.token?.root
                && pipeline.depositType === 'credit'
            ),
        )
    }

    public get isSwapEnabled(): boolean {
        return this.depositType === 'credit'
    }

    public get isInsufficientEverBalance(): boolean {
        return new BigNumber(this.everWallet.balance || 0).lt(BridgeConstants.EmptyWalletMinTonsAmount)
    }

    public get isInsufficientVaultBalance(): boolean {
        return new BigNumber(this.pipeline?.vaultBalance ?? 0)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals ?? 0))
            .lt(this.amountNumber)
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

    public get rightNetworks(): LabeledNetwork[] {
        if (process.env.NODE_ENV !== 'production') {
            return getLabeledNetworks()
        }
        return getLabeledNetworks().filter(
            ({ value }) => value !== this.leftNetwork?.id,
        )
    }

    public get token(): TokenCache | undefined {
        if (this.data.selectedToken === undefined) {
            return undefined
        }

        if (this.isFromEvm && this.leftNetwork !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.leftNetwork.chainId).find(
                ({ root }) => root === this.data.selectedToken,
            )
        }

        if (this.isEverscaleToEvm && this.rightNetwork !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.rightNetwork.chainId).find(
                ({ root }) => root === this.data.selectedToken,
            )
        }

        return this.tokensCache.get(this.data.selectedToken)
    }

    public get vaultLimit(): Pipeline['vaultLimit'] {
        return this.pipeline?.vaultLimit
    }

    public get vaultLimitNumber(): BigNumber {
        return new BigNumber(this.vaultLimit ?? 0)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals ?? 0))
            .shiftedBy(this.amountMinDecimals)
            .dp(0, BigNumber.ROUND_DOWN)
    }

    public get tokens(): TokenCache[] {
        const leftChainId = this.leftNetwork?.chainId
        const rightChainId = this.rightNetwork?.chainId

        if (this.isEvmToEvm && leftChainId !== undefined && rightChainId !== undefined) {
            return this.tokensCache.tokens.filter(
                token => Object.values(token.pipelines).some(
                    pipeline => (
                        pipeline.vaults.some(vault => (vault.chainId === leftChainId && vault.depositType === 'credit'))
                        && pipeline.vaults.some(vault => (vault.chainId === rightChainId && vault.depositType === 'default'))
                    ) || false,
                ),
            )
        }

        if (this.isEvmToEverscale && leftChainId !== undefined) {
            return this.tokensCache.filterTokensByChainId(leftChainId)
        }

        if (this.isEverscaleToEvm && rightChainId !== undefined) {
            return this.tokensCache.filterTokensByChainId(rightChainId)
        }

        log('Returns all tokens')
        return this.tokensCache.tokens
    }

    public get tokenAmountNumber(): BigNumber {
        return new BigNumber(this.tokenAmount || 0)
    }

    public get eversAmountNumber(): BigNumber {
        return new BigNumber(this.eversAmount || 0)
    }

    protected get debt(): BigNumber {
        return new BigNumber(BridgeConstants.CreditBody)
            .plus(new BigNumber(this.data.creditFactoryFee || 0))
            .shiftedBy(-DexConstants.CoinDecimals)
    }

    protected get pairContract(): Contract<typeof DexAbi.Pair> | undefined {
        return this.data.pairAddress !== undefined
            ? new rpc.Contract(DexAbi.Pair, this.data.pairAddress)
            : undefined
    }

    /**
     * @protected
     */
    protected get vaultContract(): EthContract | undefined {
        return this.tokensCache.getEvmTokenVaultContract(this.pipeline)
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useTokensCache(): TokensCacheService {
        return this.tokensCache
    }

    #everWalletBalanceDisposer: IReactionDisposer | undefined

    #everWalletDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #swapDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}
