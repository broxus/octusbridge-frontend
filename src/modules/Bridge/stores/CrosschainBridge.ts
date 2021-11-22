import BigNumber from 'bignumber.js'
import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction, toJS,
} from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'

import {
    BridgeConstants,
    Dex,
    DexAbi,
    DexConstants,
} from '@/misc'
import {
    DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA,
    DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    NetworkFields,
} from '@/modules/Bridge/types'
import {
    amountWithSlippage,
    getCreditFactoryContract,
    getTonMainNetwork,
    isTonMainNetwork,
} from '@/modules/Bridge/utils'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenAssetVault, TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import {
    debug,
    error,
    isGoodBignumber,
    throwException,
    validateMaxValue,
    validateMinValue,
} from '@/utils'


const maxSlippage = BridgeConstants.DepositToFactoryMaxSlippage
const minSlippage = BridgeConstants.DepositToFactoryMinSlippage
const emptyWalletMinTonsAmount = new BigNumber(
    BridgeConstants.EmptyWalletMinTonsAmount,
).shiftedBy(-DexConstants.TONDecimals)


export class CrosschainBridge {

    /**
     * Current data of the bridge forms.
     * @type {CrosschainBridgeStoreData}
     * @protected
     */
    protected data: CrosschainBridgeStoreData = DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA

    /**
     * Current state of the bridge store and forms.
     * @type {CrosschainBridgeStoreState}
     * @protected
     */
    protected state: CrosschainBridgeStoreState = DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly tonWallet: TonWalletService,
        protected readonly tokensCache: TokensCacheService,
    ) {
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
            if (isTonMainNetwork(value)) {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('rightAddress', this.evmWallet.address || '')
                this.changeData('rightNetwork', this.leftNetwork)
            }
            else if (value.type === 'evm') {
                this.changeData('leftAddress', this.evmWallet.address || '')
                this.changeData('rightAddress', this.tonWallet.address || '')
                this.changeData('rightNetwork', getTonMainNetwork())
            }
        }

        if (key === 'rightNetwork') {
            if (isTonMainNetwork(value)) {
                this.changeData('leftAddress', this.evmWallet.address || '')
                this.changeData('leftNetwork', this.rightNetwork)
                this.changeData('rightAddress', this.tonWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('leftNetwork', getTonMainNetwork())
                this.changeData('rightAddress', this.evmWallet.address || '')
            }
        }

        this.changeData(key, value)
        this.changeData('amount', '')
        this.changeData('selectedToken', undefined)
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
     * Common transfer tokens from EVM to Free TON.
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
     * Transfer from EVM to Free TON with swap tokens between selected token and TONs.
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
     * Prepare transfer from Free TON to EVM.
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

        const subscriber = ton.createSubscriber()

        try {
            const eventStream = subscriber.transactions(
                tonConfigurationContract.address,
            ).flatMap(item => item.transactions).filterMap(async tx => {
                const decodedTx = await tonConfigurationContract.decodeTransaction({
                    methods: ['deployEvent'],
                    transaction: tx,
                })

                if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                    const { eventData } = decodedTx.input.eventVoteData
                    const event = await ton.unpackFromCell({
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

            const data = await ton.packIntoCell({
                data: {
                    addr: this.rightAddress,
                    chainId: this.rightNetwork.chainId,
                },
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ] as const,
            })

            await walletContract.methods.burnByOwner({
                callback_address: new Address(this.token.proxy),
                callback_payload: data.boc,
                grams: '0',
                send_gas_to: new Address(this.tonWallet.address),
                tokens: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
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
     * Manually callback to recalculate tokens field after change amount field value
     */
    public async onChangeAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.pairContract === undefined
            || this.token === undefined
        ) {
            return
        }

        try {
            await this.syncMaxTonsAmount()

            if (!this.amount || this.amountNumber.isZero()) {
                this.changeData('minReceiveTokens', '')
                this.changeData('maxTokensAmount', '')
                this.changeData('tokensAmount', '')
                this.changeData(
                    'tonsAmount',
                    this.isInsufficientTonBalance
                        ? emptyWalletMinTonsAmount.toFixed()
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
            const {
                expected_amount: maxTotalTonsAmount,
            } = await this.pairContract.methods.expectedExchange({
                _answer_id: 0,
                amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const maxTonsAmountBN = new BigNumber(maxTotalTonsAmount || 0)
                .times(new BigNumber(100).minus(maxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .shiftedBy(-DexConstants.TONDecimals)
                .minus(this.debt)
                .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

            if (this.tokensAmountNumber.isZero()) {
                this.changeData('tokensAmount', '0')
                this.changeData('minReceiveTokens', '0')
                this.changeData('swapType', '1')

                if (isGoodBignumber(maxTonsAmountBN)) {
                    this.changeData('tonsAmount', maxTonsAmountBN.toFixed())
                }
            }
            else {
                const minSpentTokensNumber = this.amountNumber.minus(this.tokensAmountNumber)

                const {
                    expected_amount: toExchangeAmount,
                } = await this.pairContract.methods.expectedExchange({
                    _answer_id: 0,
                    amount: minSpentTokensNumber
                        .shiftedBy(this.token.decimals)
                        .dp(0, BigNumber.ROUND_DOWN)
                        .toFixed(),
                    spent_token_root: new Address(this.token.root),
                }).call({
                    cachedState: toJS(this.data.pairState),
                })

                const tonsAmountBN = new BigNumber(toExchangeAmount || 0)
                    .times(new BigNumber(100).minus(minSlippage))
                    .div(100)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .shiftedBy(-DexConstants.TONDecimals)
                    .minus(this.debt)
                    .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

                this.changeData('swapType', '0')

                const {
                    expected_amount: maxSpendTokens,
                } = await this.pairContract.methods.expectedSpendAmount({
                    _answer_id: 0,
                    receive_amount: this.debt
                        .plus(tonsAmountBN)
                        .times(100)
                        .div(new BigNumber(100).minus(maxSlippage))
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
                    this.changeData('tokensAmount', '0')
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
            const {
                expected_amount: maxSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: this.debt
                    .plus(this.tonsAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(maxSlippage))
                    .shiftedBy(DexConstants.TONDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const minTokensAmountBN = this.amountNumber.shiftedBy(this.amountDecimals).minus(maxSpendTokens || 0)

            if (isGoodBignumber(minTokensAmountBN)) {
                this.changeData('swapType', '0')
                this.changeData('minReceiveTokens', minTokensAmountBN.toFixed())
            }
            else {
                this.changeData('minReceiveTokens', '')
                this.changeData('tokensAmount', '')
                return
            }

            const {
                expected_amount: minSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: this.debt
                    .plus(this.tonsAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(minSlippage))
                    .shiftedBy(DexConstants.TONDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const tokensAmountBN = this.amountNumber
                .shiftedBy(this.amountDecimals)
                .minus(minSpendTokens || 0)
                .shiftedBy(-this.token.decimals)

            if (isGoodBignumber(tokensAmountBN)) {
                this.changeData('swapType', '0')
                this.changeData('tokensAmount', tokensAmountBN.toFixed())
            }
        }
        catch (e) {
            error('Change tons amount recalculate error', e)
        }
    }

    /**
     *
     * @protected
     */
    public async onSwapToggle(): Promise<void> {
        if (!this.isSwapEnabled) {
            this.changeData('tokensAmount', '')
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
            depositType: 'default',
            maxTokensAmount: '',
            maxTonsAmount: '',
            minAmount: '',
            minReceiveTokens: '',
            minTonsAmount: '',
            tokensAmount: '',
            tonsAmount: '',
            pairAddress: undefined,
        }
        this.state = {
            ...this.state,
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
        debug('handleChangeToken')

        if (selectedToken === undefined) {
            return
        }

        this.resetAsset()

        if (this.isFromEvm && this.isCreditAvailable) {
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
            if (this.isFromEvm && !this.leftAddress) {
                this.changeData('leftAddress', this.evmWallet.address || '')
            }
            else if (this.isTonToEvm && !this.rightAddress) {
                this.changeData('rightAddress', this.evmWallet.address || '')
            }
        }
        else if (this.leftNetwork?.type === 'evm') {
            this.changeData('amount', '')
            this.changeData('leftAddress', '')
            this.changeData('leftNetwork', undefined)
            this.changeData('selectedToken', undefined)
            this.changeState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
        else if (this.rightNetwork?.type === 'evm') {
            this.changeData('rightAddress', '')
            this.changeData('rightNetwork', undefined)
        }
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
            else if (this.isTonToEvm && !this.leftAddress) {
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
        else {
            this.changeState('isSwapEnabled', false)
            this.changeData('tonsAmount', '')
            this.changeData('minTonsAmount', '')

            if (this.rightNetwork?.type === 'ton') {
                this.changeData('rightAddress', '')
                this.changeData('rightNetwork', undefined)
            }
            else if (this.leftNetwork?.type === 'ton') {
                this.changeData('amount', '')
                this.changeData('leftAddress', '')
                this.changeData('leftNetwork', undefined)
                this.changeData('selectedToken', undefined)
                this.changeState('step', CrosschainBridgeStep.SELECT_ROUTE)
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
    protected async syncMinReceiveTokens(): Promise<void> {
        if (this.pairContract === undefined || this.token === undefined) {
            return
        }

        try {
            const result = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: amountWithSlippage(
                    this.debt.plus(this.tonsAmountNumber),
                    maxSlippage,
                ),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const minReceiveTokens = this.amountNumber
                .shiftedBy(this.token.decimals)
                .minus(result.expected_amount || 0)
                .dp(0, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(minReceiveTokens)) {
                this.changeData('minReceiveTokens', minReceiveTokens.toFixed())
            }
            else {
                this.changeData('minReceiveTokens', '')
                this.changeData('tokensAmount', '')
                this.changeData('maxTokensAmount', '')
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
            const result = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: amountWithSlippage(this.debt.plus(this.tonsAmountNumber), minSlippage),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const tokensAmount = this.amountNumber.shiftedBy(this.token.decimals).minus(result.expected_amount || 0)

            if (isGoodBignumber(tokensAmount)) {
                this.changeData(
                    'maxTokensAmount',
                    tokensAmount.toFixed(),
                )
                this.changeData(
                    'tokensAmount',
                    tokensAmount
                        .shiftedBy(-this.token.decimals)
                        .dp(this.token.decimals, BigNumber.ROUND_DOWN)
                        .toFixed(),
                )
            }
            else {
                this.changeData('maxTokensAmount', '')
                this.changeData('tokensAmount', '')
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
            const result = await this.pairContract.methods.expectedExchange({
                _answer_id: 0,
                amount: this.amountNumber
                    .shiftedBy(this.token.decimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const tonsAmountBN = new BigNumber(result.expected_amount || 0)
                .times(new BigNumber(100).minus(maxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .minus(this.debt.shiftedBy(DexConstants.TONDecimals))
                .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(tonsAmountBN)) {
                this.changeData('maxTonsAmount', tonsAmountBN.toFixed())
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
            const result = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: this.debt.shiftedBy(DexConstants.TONDecimals)
                    .plus(this.minTonsAmount || 0)
                    .times(100)
                    .div(new BigNumber(100).minus(maxSlippage))
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call({
                cachedState: toJS(this.data.pairState),
            })

            const minAmountBN = new BigNumber(result.expected_amount || 0)
                .plus(1)
                .shiftedBy(-this.token.decimals)
                .shiftedBy(this.amountDecimals)
                .dp(0, BigNumber.ROUND_DOWN)

            if (isGoodBignumber(minAmountBN)) {
                this.changeData('minAmount', minAmountBN.toFixed())
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

            this.changeData('pairAddress', pairAddress)
            this.changeData('pairState', (await ton.getFullContractState({
                address: pairAddress,
            })).state)
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
            if (this.isTonToEvm) {
                await this.tokensCache.syncTonToken(this.token.root)
                if (this.rightNetwork?.chainId !== undefined) {
                    await this.tokensCache.syncEvmToken(this.token.root, this.rightNetwork.chainId)
                }
            }
            else if (this.leftNetwork?.chainId !== undefined) {
                await this.tokensCache.syncEvmToken(this.token.root, this.leftNetwork.chainId)
            }
        }
        catch (e) {
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

    public get maxTokensAmount(): CrosschainBridgeStoreData['maxTokensAmount'] {
        return this.data.maxTokensAmount
    }

    public get maxTonsAmount(): CrosschainBridgeStoreData['maxTonsAmount'] {
        return this.data.maxTonsAmount
    }

    public get minAmount(): CrosschainBridgeStoreData['minAmount'] {
        return this.data.minAmount
    }

    public get minTonsAmount(): CrosschainBridgeStoreData['minTonsAmount'] {
        return this.data.minTonsAmount
    }

    public get tokensAmount(): CrosschainBridgeStoreData['tokensAmount'] {
        return this.data.tokensAmount
    }

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

    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get amountDecimals(): number {
        if (this.token === undefined || this.tokenVault?.decimals === undefined) {
            return 0
        }
        return Math.min(this.token.decimals, this.tokenVault.decimals)
    }

    public get balance(): string | undefined {
        return this.isTonToEvm ? this.token?.balance : this.tokenVault?.balance
    }

    public get balanceNumber(): BigNumber {
        return (
            this.isTonToEvm
                ? new BigNumber(this.token?.balance || 0)
                    .shiftedBy(this.token?.decimals ? -this.token.decimals : 0)
                : new BigNumber(this.tokenVault?.balance || 0)
                    .shiftedBy(this.tokenVault?.decimals ? -this.tokenVault.decimals : 0)
        )
    }

    public get tokensAmountNumber(): BigNumber {
        return new BigNumber(this.tokensAmount || 0)
    }

    public get tonsAmountNumber(): BigNumber {
        return new BigNumber(this.tonsAmount || 0)
    }

    public get decimals(): number | undefined {
        if (this.isTonToEvm) {
            return this.token?.decimals
        }
        return this.tokenVault?.decimals
    }

    public get minReceiveTokensNumber(): BigNumber {
        return new BigNumber(this.minReceiveTokens || 0)
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

        return undefined
    }

    public get tokens(): TokenCache[] {
        if (this.isFromEvm && this.leftNetwork?.chainId !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.leftNetwork.chainId)
        }

        if (this.isTonToEvm && this.rightNetwork?.chainId !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.rightNetwork.chainId)
        }

        return []
    }

    public get isAmountValid(): boolean {
        if (this.isSwapEnabled && isGoodBignumber(this.amountNumber)) {
            return (
                validateMinValue(this.minAmount, this.amount, this.amountDecimals)
                && validateMaxValue(this.balanceNumber.toFixed(), this.amount)
            )
        }
        return this.amount.length > 0
            ? validateMaxValue(this.balance, this.amount, this.decimals)
            : true
    }

    public get isTokensAmountValid(): boolean {
        if (this.tokensAmount && isGoodBignumber(this.tokensAmountNumber, false)) {
            return (
                validateMinValue('0', this.tokensAmount, this.token?.decimals)
                && validateMaxValue(this.maxTokensAmount, this.tokensAmount, this.token?.decimals)
            )
        }
        return isGoodBignumber(this.tokensAmountNumber, false)
    }

    public get isTonsAmountValid(): boolean {
        if (this.isInsufficientTonBalance) {
            return (
                validateMinValue(this.minTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
                && validateMaxValue(this.maxTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
            )
        }
        if (this.tonsAmount && isGoodBignumber(this.tonsAmountNumber)) {
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
        return (
            this.tonWallet.isConnected
            && this.evmWallet.isConnected
            && this.leftNetwork !== undefined
            && !!this.leftAddress
            && this.rightNetwork !== undefined
            && !!this.rightAddress
        )
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

    public get isEvmToTon(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        return this.leftNetwork?.type === 'evm'
    }

    public get isTonToEvm(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        return this.leftNetwork?.type === 'ton'
    }

    public get isEvmToEvm(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isFromEvm(): boolean {
        return this.isEvmToTon || this.isEvmToEvm
    }

    protected get debt(): BigNumber {
        return new BigNumber(BridgeConstants.CreditBody)
            .plus(new BigNumber(this.data.creditFactoryFee || 0))
            .shiftedBy(-DexConstants.TONDecimals)
    }

    protected get pairContract(): Contract<typeof DexAbi.Pair> | undefined {
        return this.data.pairAddress !== undefined
            ? new Contract(DexAbi.Pair, this.data.pairAddress)
            : undefined
    }

    protected get tokenVault(): TokenAssetVault | undefined {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return undefined
        }

        return this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            this.depositType,
        )
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
