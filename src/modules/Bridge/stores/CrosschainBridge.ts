import BigNumber from 'bignumber.js'
import isEqual from 'lodash.isequal'
import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction,
    toJS,
} from 'mobx'
import { Address, Contract } from 'everscale-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'

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
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenAssetVault, TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import {
    debug,
    error,
    getLabeledNetworks,
    getTonMainNetwork,
    isEvmAddressValid,
    isGoodBignumber,
    isTonAddressValid,
    log,
    throwException,
    validateMaxValue,
    validateMinValue,
} from '@/utils'
import { LabeledNetwork } from '@/types'
import rpc from '@/hooks/useRpcClient'

export class CrosschainBridge {

    /**
     * Current data of the bridge forms.
     * @type {CrosschainBridgeStoreData}
     * @protected
     */
    protected data: CrosschainBridgeStoreData

    /**
     * Current state of the bridge store and forms.
     * @type {CrosschainBridgeStoreState}
     * @protected
     */
    protected state: CrosschainBridgeStoreState

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly tonWallet: TonWalletService,
        protected readonly tokensCache: TokensCacheService,
    ) {
        this.data = DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA
        this.state = DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE

        makeAutoObservable<
            CrosschainBridge,
            | 'handleChangeToken'
            | 'handleEvmWalletConnection'
            | 'handleTonWalletConnection'
            | 'handleTonWalletBalance'
        >(this, {
            handleChangeToken: action.bound,
            handleEvmWalletConnection: action.bound,
            handleTonWalletConnection: action.bound,
            handleTonWalletBalance: action.bound,
        })
    }


    /*
     * Public actions. Useful in UI
     * ----------------------------------------------------------------------------------
     */

    /**
     * Change store data by the given key and value.
     * @param {K extends keyof CrosschainBridgeStoreData} key
     * @param {CrosschainBridgeStoreData[K]} value
     */
    public changeData<K extends keyof CrosschainBridgeStoreData>(
        key: K,
        value: CrosschainBridgeStoreData[K],
    ): void {
        this.data[key] = value
    }

    /**
     * Change store state by the given key and value.
     * @param {K extends keyof CrosschainBridgeStoreState} key
     * @param {CrosschainBridgeStoreState[K]} value
     */
    public changeState<K extends keyof CrosschainBridgeStoreState>(
        key: K,
        value: CrosschainBridgeStoreState[K],
    ): void {
        this.state[key] = value
    }

    /**
     * Change network by the given key and value.
     * @param {K extends keyof NetworkFields} key
     * @param {NetworkFields[K]} value
     */
    public changeNetwork<K extends keyof NetworkFields>(key: K, value: NetworkFields[K]): void {
        if (value === undefined) {
            return
        }

        if (key === 'leftNetwork') {
            if (value.type === 'ton') {
                this.changeData('leftAddress', this.tonWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.changeData('leftAddress', this.evmWallet.address || '')
            }
            if (value.id === this.rightNetwork?.id) {
                const { leftAddress, rightAddress } = this
                this.changeData('rightNetwork', this.leftNetwork)
                this.changeData('rightAddress', leftAddress)
                this.changeData('leftAddress', rightAddress)
            }
        }
        else if (key === 'rightNetwork') {
            if (value.type === 'ton') {
                this.changeData('rightAddress', this.tonWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.changeData('rightAddress', this.evmWallet.address || '')
            }
        }

        this.resetAsset()
        this.changeData(key, value)
        this.changeData('depositType', this.isEvmToEvm ? 'credit' : 'default')
    }

    /**
     * Manually initiate store.
     * Run all necessary reaction subscribers.
     */
    public init(): void {
        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, this.handleEvmWalletConnection)
        this.#swapDisposer = reaction(() => this.isSwapEnabled, async isEnabled => {
            this.changeData('depositType', isEnabled ? 'credit' : 'default')
            if (isEnabled) {
                await this.syncMinAmount()
            }
            else {
                this.changeData('minAmount', '')
            }
        })
        this.#tokenDisposer = reaction(() => this.data.selectedToken, this.handleChangeToken)
        this.#tonWalletDisposer = reaction(() => this.tonWallet.isConnected, this.handleTonWalletConnection)
        this.#tonWalletBalanceDisposer = reaction(
            () => [this.tonWallet.balance, this.tonWallet.isUpdatingContract],
            this.handleTonWalletBalance,
        )
    }

    /**
     * Manually dispose of all reaction subscribers.
     * Reset all data to their defaults.
     */
    public dispose(): void {
        this.#evmWalletDisposer?.()
        this.#swapDisposer?.()
        this.#tonWalletDisposer?.()
        this.#tonWalletBalanceDisposer?.()
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
                || this.tokenVault?.decimals === undefined
            ) {
                return
            }

            this.changeState('isPendingApproval', true)

            const tokenContract = await this.tokensCache.getEthTokenContract(this.token.root, this.leftNetwork.chainId)

            if (tokenContract === undefined) {
                this.changeState('isPendingApproval', false)
                return
            }

            try {
                tries += 1

                if (this.approvalStrategy === 'infinity') {
                    await tokenContract.methods.approve(
                        this.tokenVault.vault,
                        '340282366920938463426481119284349108225',
                    ).send({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                }
                else {
                    await tokenContract.methods.approve(
                        this.tokenVault.vault,
                        this.amountNumber
                            .shiftedBy(this.tokenVault.decimals)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed(),
                    ).send({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                }

                this.changeState('step', CrosschainBridgeStep.TRANSFER)
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
                this.changeState('isPendingApproval', false)
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
            || this.leftNetwork === undefined
            || this.tokenVault?.decimals === undefined
        ) {
            return
        }

        const tokenContract = await this.tokensCache.getEthTokenContract(
            this.token.root,
            this.leftNetwork.chainId,
        )

        if (tokenContract === undefined) {
            return
        }

        this.changeState('isPendingAllowance', true)

        try {
            const allowance = await tokenContract.methods.allowance(
                this.evmWallet.address,
                this.tokenVault.vault,
            ).call()

            const approvalDelta = new BigNumber(allowance).minus(
                this.amountNumber.shiftedBy(this.tokenVault.decimals).dp(0, BigNumber.ROUND_DOWN),
            )

            if (approvalDelta.lt(0)) {
                this.changeState('step', CrosschainBridgeStep.SELECT_APPROVAL_STRATEGY)
            }
            else {
                this.changeState('step', CrosschainBridgeStep.TRANSFER)
            }
        }
        catch (e) {
            error('Check allowance error', e)
        }
        finally {
            this.changeState('isPendingAllowance', false)
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
                || this.leftNetwork === undefined
                || this.tokenVault?.decimals === undefined
                || this.wrapperContract === undefined
            ) {
                return
            }

            const target = this.rightAddress.split(':')

            this.changeState('isProcessing', true)

            try {
                tries += 1

                await this.wrapperContract.methods.deposit(
                    [target[0], `0x${target[1]}`],
                    this.amountNumber.shiftedBy(this.tokenVault.decimals).dp(0, BigNumber.ROUND_DOWN).toFixed(),
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                }).once('transactionHash', (transactionHash: string) => {
                    this.changeData('txHash', transactionHash)
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
                this.changeState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Transfer from EVM to Everscale with swap tokens between selected token and TONs.
     * @param {() => void} reject
     */
    public async transferWithSwap(reject?: () => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.token === undefined
                || this.leftNetwork === undefined
                || this.tokenVault?.decimals === undefined
                || this.wrapperContract === undefined
            ) {
                return
            }

            const target = this.rightAddress.split(':')
            const creditFactoryTarget = BridgeConstants.CreditFactoryAddress.toString().split(':')

            this.changeState('isProcessing', true)

            try {
                tries += 1

                await this.wrapperContract.methods.depositToFactory(
                    this.amountNumber.shiftedBy(this.tokenVault.decimals).dp(0, BigNumber.ROUND_DOWN).toFixed(),
                    '0',
                    `0x${target[1]}`,
                    `0x${creditFactoryTarget[1]}`,
                    `0x${target[1]}`,
                    this.minReceiveTokensNumber.toFixed(),
                    this.tonsAmountNumber.shiftedBy(DexConstants.TONDecimals).toFixed(),
                    this.data.swapType,
                    BridgeConstants.DepositToFactoryMinSlippageNumerator,
                    BridgeConstants.DepositToFactoryMinSlippageDenominator,
                    `0x${Buffer.from('te6ccgEBAQEAAgAAAA==', 'base64').toString('hex')}`,
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                }).once('transactionHash', (transactionHash: string) => {
                    this.changeData('txHash', transactionHash)
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
                this.changeState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     *
     * @param {() => void} reject
     */
    public async transferWithHiddenSwap(reject?: () => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.tonWallet.address === undefined
                || this.token === undefined
                || this.leftNetwork === undefined
                || this.rightNetwork === undefined
                || this.tokenVault?.decimals === undefined
                || this.wrapperContract === undefined
            ) {
                return
            }

            const target = this.tonWallet.address.split(':')
            const creditFactoryTarget = BridgeConstants.CreditFactoryAddress.toString().split(':')
            const hiddenBridgeFactoryContract = rpc.createContract(
                TokenAbi.HiddenBridgeStrategyFactory,
                BridgeConstants.HiddenBridgeStrategyFactory,
            )

            this.changeState('isProcessing', true)

            try {
                tries += 1

                const recipient = (await hiddenBridgeFactoryContract.methods.getStrategyAddress({
                    answerId: 0,
                    tokenRoot: new Address(this.token.root),
                }).call()).value0

                const hiddenBridgeStrategyContract = rpc.createContract(
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
                    proxy: new Address(this.token.proxy),
                }).call()).value0

                await this.wrapperContract.methods.depositToFactory(
                    this.amountNumber.shiftedBy(this.tokenVault.decimals).dp(0, BigNumber.ROUND_DOWN).toFixed(),
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
                    this.changeData('txHash', transactionHash)
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
                this.changeState('isProcessing', false)
            }
        }

        await send(this.leftNetwork?.transactionType)
    }

    /**
     * Prepare transfer from Everscale to EVM.
     * @param {() => void} reject
     */
    public async prepareTonToEvm(reject?: () => void): Promise<void> {
        if (
            this.rightNetwork?.chainId === undefined
            || !this.rightAddress
            || this.token === undefined
            || this.tonWallet.address === undefined
        ) {
            return
        }

        this.changeState('isProcessing', true)

        const tonConfigurationContract = await this.tokensCache.getTonConfigurationContract(this.token.root)

        if (tonConfigurationContract === undefined) {
            this.changeState('isProcessing', false)
            return
        }

        const tonConfigurationState = (await rpc.getFullContractState({
            address: tonConfigurationContract.address,
        })).state

        const subscriber = rpc.createSubscriber()

        try {
            const oldStream = subscriber.oldTransactions(
                tonConfigurationContract.address,
                {
                    fromLt: tonConfigurationState?.lastTransactionId?.lt,
                },
            )
            const eventStream = oldStream.merge(subscriber.transactions(
                tonConfigurationContract.address,
            )).flatMap(item => item.transactions).filterMap(async tx => {

                console.log(tx)

                const decodedTx = await tonConfigurationContract.decodeTransaction({
                    methods: ['deployEvent'],
                    transaction: tx,
                })

                console.log(decodedTx)

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

                    console.log(event)

                    const checkAddress = `${event.data.wid}:${new BigNumber(event.data.addr).toString(16).padStart(64, '0')}`
                    const checkEvmAddress = `0x${new BigNumber(event.data.eth_addr).toString(16).padStart(40, '0')}`

                    if (
                        checkAddress.toLowerCase() === this.leftAddress.toLowerCase()
                        && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
                    ) {
                        const eventAddress = await tonConfigurationContract.methods.deriveEventAddress({
                            answerId: 0,
                            eventVoteData: decodedTx.input.eventVoteData,
                        }).call()

                        return eventAddress.eventContract
                    }

                    return undefined
                }

                return undefined
            })

            const walletContract = await this.tokensCache.getTonTokenWalletContract(this.token.root)

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

            await walletContract.methods.burn({
                callbackTo: new Address(this.token.proxy),
                payload: data.boc,
                remainingGasTo: new Address(this.tonWallet.address),
                amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
            }).send({
                amount: '6000000000',
                bounce: true,
                from: new Address(this.leftAddress),
            })

            const eventAddress = await eventStream.first()

            this.changeData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.()
            error('Prepare TON to EVM error', e)
            await subscriber.unsubscribe()
        }
        finally {
            this.changeState('isProcessing', false)
        }
    }

    /**
     * Should be called after manually change amount field value for EVM-TON or EVM-EVM modes.
     * - EVM-EVM check min receive tokens
     * - EVM-TON (swap mode) sync max TONs amount, sync min receive and tokens amounts.
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
            this.changeState('isCalculating', true)

            await this.syncMaxTonsAmount()

            if (!this.amount || this.amountNumber.isZero()) {
                this.changeData('minReceiveTokens', '')
                this.changeData('maxTokenAmount', '')
                this.changeData('tokenAmount', '')
                this.changeData(
                    'tonsAmount',
                    this.isInsufficientTonBalance
                        ? EMPTY_WALLET_MIN_TONS_AMOUNT.toFixed()
                        : this.tonsAmount,
                )
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
            this.changeState('isCalculating', false)
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
            this.changeState('isCalculating', true)

            const {
                expected_amount: maxTotalTonsAmount,
            } = await this.pairContract.methods.expectedExchange({
                answerId: 0,
                amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const maxTonsAmountBN = new BigNumber(maxTotalTonsAmount || 0)
                .times(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .shiftedBy(-DexConstants.TONDecimals)
                .minus(this.debt)
                .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

            if (this.tokenAmountNumber.isZero()) {
                this.changeData('tokenAmount', '0')
                this.changeData('minReceiveTokens', '0')
                this.changeData('swapType', '1')

                if (isGoodBignumber(maxTonsAmountBN)) {
                    this.changeData('tonsAmount', maxTonsAmountBN.toFixed())
                }
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

                const tonsAmountBN = new BigNumber(toExchangeAmount || 0)
                    .times(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMinSlippage))
                    .div(100)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .shiftedBy(-DexConstants.TONDecimals)
                    .minus(this.debt)
                    .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

                this.changeData('swapType', '0')

                const {
                    expected_amount: maxSpendTokens,
                } = await this.pairContract.methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .plus(tonsAmountBN)
                        .times(100)
                        .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                        .shiftedBy(DexConstants.TONDecimals)
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call({
                    cachedState: toJS(this.data.pairState),
                })

                const minTokensAmountBN = this.amountNumber.shiftedBy(this.token.decimals).minus(maxSpendTokens)

                if (isGoodBignumber(minTokensAmountBN)) {
                    this.changeData('minReceiveTokens', minTokensAmountBN.toFixed())

                    if (isGoodBignumber(tonsAmountBN) || tonsAmountBN.isZero()) {
                        this.changeData('tonsAmount', tonsAmountBN.toFixed())
                        this.checkSwapCredit()
                        this.checkMinTons()
                    }
                }
                else {
                    this.changeData('tokenAmount', '0')
                    this.changeData('minReceiveTokens', '0')
                    this.changeData('swapType', '1')

                    if (isGoodBignumber(maxTonsAmountBN)) {
                        this.changeData('tonsAmount', maxTonsAmountBN.toFixed())
                        this.checkSwapCredit()
                        this.checkMinTons()
                    }
                }
            }
        }
        catch (e) {
            error('Change tokens amount recalculate error', e)
        }
        finally {
            this.changeState('isCalculating', false)
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
            this.changeState('isCalculating', true)

            const {
                expected_amount: maxSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: this.debt
                    .plus(this.tonsAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                    .shiftedBy(DexConstants.TONDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const minTokensAmountBN = this.amountNumber.shiftedBy(this.amountMinDecimals).minus(maxSpendTokens || 0)

            if (isGoodBignumber(minTokensAmountBN)) {
                this.changeData('swapType', '0')
                this.changeData('minReceiveTokens', minTokensAmountBN.toFixed())
            }
            else {
                this.changeData('minReceiveTokens', '')
                this.changeData('tokenAmount', '')
                return
            }

            const {
                expected_amount: minSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                answerId: 0,
                receive_amount: this.debt
                    .plus(this.tonsAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMinSlippage))
                    .shiftedBy(DexConstants.TONDecimals)
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
                this.changeData('swapType', '0')
                this.changeData('tokenAmount', tokensAmountBN.toFixed())
            }
        }
        catch (e) {
            error('Change tons amount recalculate error', e)
        }
        finally {
            this.changeState('isCalculating', false)
        }
    }

    /**
     *
     * @protected
     */
    public async onSwapToggle(): Promise<void> {
        if (!this.isSwapEnabled) {
            this.changeData('tokenAmount', '')
            this.changeData('tonsAmount', '')
            this.changeData('minAmount', '')
            return
        }

        this.checkSwapCredit()
        this.checkMinTons()

        await this.syncToken()

        if (isGoodBignumber(this.amountNumber)) {
            await this.onChangeAmount()
        }
    }

    /**
     *
     */
    public resetAsset(): void {
        this.data = {
            ...this.data,
            amount: '',
            bridgeFee: undefined,
            depositType: this.isEvmToEvm ? 'credit' : 'default',
            maxTokenAmount: undefined,
            maxTonsAmount: undefined,
            minAmount: undefined,
            minTransferFee: undefined,
            minReceiveTokens: undefined,
            minTonsAmount: undefined,
            tokenAmount: undefined,
            tonsAmount: undefined,
            pairAddress: undefined,
            pairState: undefined,
        }
        this.state = {
            ...this.state,
            isCalculating: false,
            isFetching: false,
            isLocked: false,
            isPendingAllowance: false,
            isSwapEnabled: false,
        }
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
            this.changeState('isFetching', true)

            if (this.isFromEvm && this.isCreditAvailable) {
                if (this.isEvmToEvm) {
                    await Promise.all([
                        this.syncToken(),
                        this.tonWallet.isConnected ? this.syncPair() : undefined,
                        this.syncCreditFactoryFee(),
                    ])
                    await this.syncTransferFees()
                    return
                }

                this.checkSwapCredit()
                this.checkMinTons()

                await this.syncToken()
                await this.syncCreditFactoryFee()

                if (this.tonWallet.isConnected) {
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
            this.changeState('isFetching', false)
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
                this.changeData('leftAddress', this.evmWallet.address || '')
            }
            if (this.rightNetwork?.type === 'evm' && !this.rightAddress) {
                this.changeData('rightAddress', this.evmWallet.address || '')
            }
        }
        // else if (this.leftNetwork?.type === 'evm') {
        //     this.changeData('amount', '')
        //     this.changeData('leftAddress', '')
        //     this.changeData('leftNetwork', undefined)
        //     this.changeData('selectedToken', undefined)
        //     this.changeState('step', CrosschainBridgeStep.SELECT_ROUTE)
        // }
        // else if (this.rightNetwork?.type === 'evm') {
        //     this.changeData('rightAddress', '')
        //     this.changeData('rightNetwork', undefined)
        // }
    }

    /**
     *
     * @protected
     */
    protected handleTonWalletBalance(): void {
        debug('handleTonWalletBalance')

        if (this.isFromEvm && this.isCreditAvailable) {
            this.checkSwapCredit()
            this.checkMinTons()
        }
    }

    /**
     *
     * @param connected
     * @protected
     */
    protected async handleTonWalletConnection(connected?: boolean): Promise<void> {
        debug('handleTonWalletConnection')

        if (this.state.isProcessing) {
            return
        }

        if (connected) {
            const tonNetwork = getTonMainNetwork()
            if (this.isFromEvm && !this.rightAddress) {
                this.changeData('rightAddress', this.tonWallet.address || '')
                this.changeData('rightNetwork', tonNetwork)
            }
            else if (this.isFromTon && !this.leftAddress) {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('leftNetwork', tonNetwork)
            }

            if (this.isFromEvm) {
                this.checkSwapCredit()
                this.checkMinTons()
                await this.syncPair()
                if (this.isSwapEnabled) {
                    await this.syncMinAmount()
                }
                await this.onChangeAmount()
            }
        }
        // else {
        //     this.changeState('isSwapEnabled', false)
        //     this.changeData('tonsAmount', '')
        //     this.changeData('minTonsAmount', '')
        //
        //     if (this.rightNetwork?.type === 'ton') {
        //         this.changeData('rightAddress', '')
        //         this.changeData('rightNetwork', undefined)
        //     }
        //     else if (this.leftNetwork?.type === 'ton') {
        //         this.changeData('amount', '')
        //         this.changeData('leftAddress', '')
        //         this.changeData('leftNetwork', undefined)
        //         this.changeData('selectedToken', undefined)
        //         this.changeState('step', CrosschainBridgeStep.SELECT_ROUTE)
        //     }
        // }
    }


    /*
     * Internal utilities methods
     * ----------------------------------------------------------------------------------
     */

    /**
     *
     * @protected
     */
    protected checkMinTons(): void {
        if (this.isInsufficientTonBalance && this.isSwapEnabled && !this.tonWallet.isUpdatingContract) {
            const isEnoughTonsAmount = this.tonsAmountNumber
                .shiftedBy(DexConstants.TONDecimals)
                .gte(this.minTonsAmount || 0)

            if (!isEnoughTonsAmount) {
                this.changeData(
                    'tonsAmount',
                    new BigNumber(this.minTonsAmount || 0)
                        .shiftedBy(-DexConstants.TONDecimals)
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
        if (this.tonWallet.isConnected && !this.tonWallet.isUpdatingContract && this.isInsufficientTonBalance) {
            if (this.step === CrosschainBridgeStep.SELECT_ASSET) {
                this.changeData('minTonsAmount', BridgeConstants.EmptyWalletMinTonsAmount)
                this.changeState('isSwapEnabled', this.isCreditAvailable)
            }
        }
        else {
            this.changeData('minTonsAmount', '0')
        }
    }

    /**
     *
     * @protected
     */
    protected checkMinReceiveTokens(): void {
        if (!isGoodBignumber(this.amountNumber)) {
            this.changeData('minReceiveTokens', '')
            this.changeData('tokenAmount', '')
        }

        if (
            this.token === undefined
            || this.decimals === undefined
            || this.rightNetwork?.chainId === undefined
        ) {
            return
        }

        const tokenVault = this.tokensCache.getTokenVault(
            this.token.root,
            this.rightNetwork.chainId,
        )

        if (tokenVault?.decimals === undefined) {
            return
        }

        const minReceiveTokensNumber = this.amountNumber.shiftedBy(this.amountMinDecimals)
            .minus(this.data.maxTransferFee || 0)
            // .minus(0) // Bridge fee. 0 now

        if (isGoodBignumber(minReceiveTokensNumber)) {
            // For send int transactopn
            this.changeData(
                'minReceiveTokens',
                minReceiveTokensNumber
                    .dp(tokenVault.decimals, BigNumber.ROUND_DOWN)
                    .toFixed(),
            )
            // For display in field
            this.changeData(
                'tokenAmount',
                minReceiveTokensNumber
                    .shiftedBy(-this.amountMinDecimals)
                    .dp(tokenVault.decimals, BigNumber.ROUND_DOWN)
                    .toFixed(),
            )
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
                    this.debt.plus(this.tonsAmountNumber),
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
                this.changeData('minReceiveTokens', minReceiveTokensNumber.toFixed())
            }
            else {
                this.changeData('minReceiveTokens', '')
                this.changeData('tokenAmount', '')
                this.changeData('maxTokenAmount', '')
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
                    this.debt.plus(this.tonsAmountNumber),
                    BridgeConstants.DepositToFactoryMinSlippage,
                ).toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })).expected_amount

            const tokensAmountNumber = this.amountNumber.shiftedBy(this.token.decimals)
                .minus(tokensAmount || 0)

            if (isGoodBignumber(tokensAmountNumber)) {
                this.changeData('maxTokenAmount', tokensAmountNumber.toFixed())
                this.changeData(
                    'tokenAmount',
                    tokensAmountNumber
                        .shiftedBy(-this.token.decimals)
                        .dp(this.token.decimals, BigNumber.ROUND_DOWN)
                        .toFixed(),
                )
            }
            else {
                this.changeData('maxTokenAmount', '')
                this.changeData('tokenAmount', '')
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
    protected async syncMaxTonsAmount(): Promise<void> {
        if (this.pairContract === undefined || this.token === undefined) {
            return
        }

        try {
            const tonsAmount = (await this.pairContract.methods.expectedExchange({
                answerId: 0,
                amount: this.amountNumber
                    .shiftedBy(this.token.decimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call({
                cachedState: toJS(this.data.pairState),
            })).expected_amount

            const tonsAmountNumber = new BigNumber(tonsAmount || 0)
                .times(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .minus(this.debt.shiftedBy(DexConstants.TONDecimals))
                .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(tonsAmountNumber)) {
                this.changeData('maxTonsAmount', tonsAmountNumber.toFixed())
            }
            else {
                this.changeData('maxTonsAmount', '0')
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
                receive_amount: this.debt.shiftedBy(DexConstants.TONDecimals)
                    .plus(this.minTonsAmount || 0)
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
                this.changeData('minAmount', minAmountNumber.toFixed())
            }
            else {
                this.changeData('minAmount', '')
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

            this.changeData('creditFactoryFee', fee)
        }
        catch (e) {
            this.changeData('creditFactoryFee', '')
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
                        .shiftedBy(DexConstants.TONDecimals)
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
                        .shiftedBy(DexConstants.TONDecimals)
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

            this.changeData('minTransferFee', results[0]?.expected_amount)
            this.changeData('maxTransferFee', results[1]?.expected_amount)
            this.changeData('minAmount', new BigNumber(results[1]?.expected_amount || 0).plus(1).toFixed())
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

            debug('Sync pair')
            this.changeData('pairAddress', pairAddress)
            this.changeData('pairState', pairState)
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
            if (this.leftNetwork?.type === 'ton') {
                await this.tokensCache.syncTonToken(this.token.root)
                debug('Sync TON token')
            }

            if (this.leftNetwork?.type === 'evm') {
                debug('Sync EVM token by left network', this.depositType, this.data.depositType)
                await this.tokensCache.syncEvmToken(this.token.root, this.leftNetwork.chainId, this.depositType)
            }

            if (this.rightNetwork?.type === 'evm') {
                debug('Sync EVM token by right network', this.depositType)
                await this.tokensCache.syncEvmToken(this.token.root, this.rightNetwork.chainId)
            }
        }
        catch (e) {
            this.changeState('isLocked', true)
            error('Sync token error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected reset(): void {
        this.data = DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA
        this.state = DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE
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

    public get maxTonsAmount(): CrosschainBridgeStoreData['maxTonsAmount'] {
        return this.data.maxTonsAmount
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
     * Returns non-shifted minimum receive TON`s amount
     */
    public get minTonsAmount(): CrosschainBridgeStoreData['minTonsAmount'] {
        return this.data.minTonsAmount
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
     * Returns non-shifted receive TON`s amount
     */
    public get tonsAmount(): CrosschainBridgeStoreData['tonsAmount'] {
        return this.data.tonsAmount
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

    public get isSwapEnabled(): CrosschainBridgeStoreState['isSwapEnabled'] {
        return this.state.isSwapEnabled
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
        if (this.token === undefined || this.tokenVault?.decimals === undefined) {
            return 0
        }
        return Math.min(this.token.decimals, this.tokenVault.decimals)
    }

    /**
     * Returns token balance in EVM token vault for `EVM to` direction.
     * Otherwise TON token balance
     */
    public get balance(): string | undefined {
        if (this.isFromEvm) {
            return this.tokenVault?.tokenBalance
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
     * Returns token decimals from EVM token vault for `EVM to` direction/
     * Otherwise TON token decimals
     */
    public get decimals(): number | undefined {
        if (this.isFromEvm) {
            return this.tokenVault?.decimals
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
        return isGoodBignumber(this.tokenVaultLimitNumber) && !validateMaxValue(
            this.tokenVaultLimitNumber.shiftedBy(-this.amountMinDecimals).toFixed(),
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
            ) && (this.isEvmToTon ? !this.isAmountVaultLimitExceed : true)
        }

        return this.isAmountMaxValueValid && (
            this.isEvmToTon ? !this.isAmountVaultLimitExceed : true
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

    public get isTonsAmountValid(): boolean {
        if (this.isInsufficientTonBalance) {
            return (
                validateMinValue(this.minTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
                && validateMaxValue(this.maxTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
            )
        }
        if (this.tonsAmount && this.tonsAmount.length > 0 && isGoodBignumber(this.tonsAmountNumber)) {
            return (
                validateMinValue('0', this.tonsAmount, DexConstants.TONDecimals)
                && validateMaxValue(this.maxTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
            )
        }
        return isGoodBignumber(this.tonsAmountNumber, false)
    }

    public get isAssetValid(): boolean {
        return (
            this.evmWallet.isConnected
            && this.tonWallet.isConnected
            && this.data.selectedToken !== undefined
            && this.amount.length > 0
            && isGoodBignumber(this.amountNumber)
            && (this.isSwapEnabled
                ? (this.isAmountValid && this.isTokensAmountValid && this.isTonsAmountValid)
                : this.isAmountValid)
        )
    }

    public get isRouteValid(): boolean {
        let isValid = (
            this.tonWallet.isConnected
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
        else if (this.isEvmToTon) {
            isValid = isValid && isTonAddressValid(this.rightAddress)
        }
        else if (this.isTonToEvm) {
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
        if (this.token === undefined || this.leftNetwork === undefined) {
            return false
        }
        return this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            'credit',
        ) !== undefined
    }

    public get isInsufficientTonBalance(): boolean {
        return new BigNumber(this.tonWallet.balance || 0).lt(BridgeConstants.EmptyWalletMinTonsAmount)
    }

    public get isEvmToEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isEvmToTon(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'ton'
    }

    public get isFromEvm(): boolean {
        return this.leftNetwork?.type === 'evm'
    }

    public get isFromTon(): boolean {
        return this.leftNetwork?.type === 'ton'
    }

    public get isTonToEvm(): boolean {
        return this.leftNetwork?.type === 'ton' && this.rightNetwork?.type === 'evm'
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

        if (this.isTonToEvm && this.rightNetwork !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.rightNetwork.chainId).find(
                ({ root }) => root === this.data.selectedToken,
            )
        }

        return this.tokensCache.get(this.data.selectedToken)
    }

    public get tokenVault(): TokenAssetVault | undefined {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return undefined
        }

        return this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            this.depositType,
        )
    }

    public get tokenVaultLimit(): TokenAssetVault['limit'] {
        return this.tokenVault?.limit
    }

    public get tokenVaultLimitNumber(): BigNumber {
        return new BigNumber(this.tokenVault?.limit || 0)
            .shiftedBy(-(this.tokenVault?.decimals || 0))
            .shiftedBy(this.amountMinDecimals)
            .dp(0, BigNumber.ROUND_DOWN)
    }

    public get tokens(): TokenCache[] {
        const leftChainId = this.leftNetwork?.chainId
        const rightChainId = this.rightNetwork?.chainId

        if (this.isEvmToEvm && leftChainId !== undefined && rightChainId !== undefined) {
            const tokens = this.tokensCache.tokens.filter(
                ({ vaults }) => ((
                    vaults.some(vault => (vault.chainId === leftChainId && vault.depositType === 'credit'))
                    && vaults.some(vault => vault.chainId === rightChainId && vault.depositType === 'default')
                ) || false),
            )
            log(
                'Tokens for EVM - EVM',
                toJS(this.data),
                toJS(this.state),
            )
            log(
                'Tokens for EVM - EVM',
                tokens,
            )
            log(
                'Tokens for EVM - EVM',
                toJS(this.tokensCache.tokens),
            )
            return tokens
        }

        if (this.isEvmToTon && leftChainId !== undefined) {
            log(
                'Tokens for EVM - TON',
                toJS(this.data),
                toJS(this.state),
            )
            log(
                'Tokens for EVM - TON',
                toJS(this.tokensCache.filterTokensByChainId(leftChainId)),
            )
            log(
                'Tokens for EVM - TON',
                toJS(this.tokensCache.tokens),
            )
            return this.tokensCache.filterTokensByChainId(leftChainId)
        }

        if (this.isTonToEvm && rightChainId !== undefined) {
            log(
                'Tokens for TON - EVM',
                toJS(this.data),
                toJS(this.state),
            )
            log(
                'Tokens for TON - EVM',
                this.tokensCache.filterTokensByChainId(rightChainId),
            )
            log('Tokens for TON - EVM',
                toJS(this.tokensCache.tokens))
            return this.tokensCache.filterTokensByChainId(rightChainId)
        }

        log('Returns all tokens')
        return this.tokensCache.tokens
    }

    public get tokenAmountNumber(): BigNumber {
        return new BigNumber(this.tokenAmount || 0)
    }

    public get tonsAmountNumber(): BigNumber {
        return new BigNumber(this.tonsAmount || 0)
    }

    protected get debt(): BigNumber {
        return new BigNumber(BridgeConstants.CreditBody)
            .plus(new BigNumber(this.data.creditFactoryFee || 0))
            .shiftedBy(-DexConstants.TONDecimals)
    }

    protected get pairContract(): Contract<typeof DexAbi.Pair> | undefined {
        return this.data.pairAddress !== undefined
            ? rpc.createContract(DexAbi.Pair, this.data.pairAddress)
            : undefined
    }

    protected get wrapperContract(): EthContract | undefined {
        if (
            this.token === undefined
            || this.leftNetwork === undefined
        ) {
            return undefined
        }

        return this.tokensCache.getEthTokenVaultWrapperContract(
            this.token.root,
            this.leftNetwork.chainId,
        )
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useTonWallet(): TonWalletService {
        return this.tonWallet
    }

    public get useTokensCache(): TokensCacheService {
        return this.tokensCache
    }

    #evmWalletDisposer: IReactionDisposer | undefined

    #swapDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #tonWalletBalanceDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}
