import BigNumber from 'bignumber.js'
import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction,
} from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'

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
} from '@/modules/Bridge/constants'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    NetworkFields,
} from '@/modules/Bridge/types'
import { amountWithSlippage, getTonMainNetwork, isTonMainNetwork } from '@/modules/Bridge/utils'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import {
    debug,
    error,
    isGoodBignumber,
    throwException,
    validateMaxValue,
    validateMinValue,
} from '@/utils'


const creditBody = new BigNumber(BridgeConstants.CreditBody).shiftedBy(-DexConstants.TONDecimals)
// FIXME брать это из CreditFactory.getDetails.fee
const fee = new BigNumber('0.1')
const debt = creditBody.plus(fee)
const emptyWalletMinTonsAmount = new BigNumber(
    BridgeConstants.EmptyWalletMinTonsAmount,
).shiftedBy(-DexConstants.TONDecimals)
const maxSlippage = BridgeConstants.DepositToFactoryMaxSlippage
const minSlippage = BridgeConstants.DepositToFactoryMinSlippage


export class CrosschainBridge {

    /**
     *
     * @protected
     */
    protected data: CrosschainBridgeStoreData = DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA

    /**
     *
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
            | 'handleSwapToggle'
            | 'handleTonWalletConnection'
            | 'handleTonWalletBalance'
        >(this, {
            handleChangeToken: action.bound,
            handleEvmWalletConnection: action.bound,
            handleSwapToggle: action.bound,
            handleTonWalletConnection: action.bound,
            handleTonWalletBalance: action.bound,
        })
    }

    /**
     *
     */
    public init(): void {
        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, this.handleEvmWalletConnection)
        this.#gasFeesDisposer = reaction(() => this.state.isSwapEnabled, this.handleSwapToggle)
        this.#tonWalletDisposer = reaction(() => this.tonWallet.isConnected, this.handleTonWalletConnection)
        this.#tonWalletBalanceDisposer = reaction(() => this.tonWallet.balance, this.handleTonWalletBalance)
        this.#tokenDisposer = reaction(() => this.data.selectedToken, this.handleChangeToken)
    }

    /**
     *
     */
    public dispose(): void {
        this.#gasFeesDisposer?.()
        this.#evmWalletDisposer?.()
        this.#tonWalletDisposer?.()
        this.#tonWalletBalanceDisposer?.()
        this.#tokenDisposer?.()
        this.reset()
    }

    /**
     *
     * @param key
     * @param value
     */
    public changeData<K extends keyof CrosschainBridgeStoreData>(
        key: K,
        value: CrosschainBridgeStoreData[K],
    ): void {
        this.data[key] = value
    }

    /**
     *
     * @param key
     * @param value
     */
    public changeState<K extends keyof CrosschainBridgeStoreState>(
        key: K,
        value: CrosschainBridgeStoreState[K],
    ): void {
        this.state[key] = value
    }

    /**
     *
     * @param key
     * @param value
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
     *
     * @protected
     */
    protected reset(): void {
        this.data = DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA
        this.state = DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE
    }

    /**
     *
     */
    public resetAsset(): void {
        this.data = {
            ...this.data,
            amount: '',
            balance: undefined,
            depositType: 'default',
            maxTokensAmount: '',
            maxTonsAmount: '',
            minAmount: '',
            minReceiveTokens: '',
            pairAddress: undefined,
        }
        this.state = {
            ...this.state,
            isPendingAllowance: false,
            isSwapEnabled: false,
        }
    }

    /**
     *
     */
    public async onChangeAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.pairContract === undefined
            || this.token === undefined
            || !this.isAmountValid
        ) {
            return
        }

        await this.syncMaxTonsAmount()
        await this.syncMaxTokensAmount()

        if (this.tokensAmount && new BigNumber(this.tokensAmount).isZero()) {
            await this.onChangeTokensAmount()
            return
        }

        try {
            if (!this.amount) {
                this.changeData('minReceiveTokens', '')
                this.changeData('maxTokensAmount', '')
                this.changeData('tokensAmount', '')
                this.changeData('tonsAmount', this.isInsufficientTonBalance ? emptyWalletMinTonsAmount.toFixed() : '')
                return
            }

            const shiftedAmount = this.amountNumber.shiftedBy(this.token.decimals)

            const [r1, r2] = await Promise.all([
                this.pairContract.methods.expectedSpendAmount({
                    _answer_id: 0,
                    receive_amount: amountWithSlippage(debt.plus(this.tonsAmountNumber), maxSlippage),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call(),
                this.pairContract.methods.expectedSpendAmount({
                    _answer_id: 0,
                    receive_amount: amountWithSlippage(debt.plus(this.tonsAmountNumber), minSlippage),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call(),
            ])

            const minTokensAmountBN = shiftedAmount.minus(r1.expected_amount || 0)

            if (isGoodBignumber(minTokensAmountBN)) {
                this.changeData('minReceiveTokens', minTokensAmountBN.toFixed())
            }

            const tokensAmountBN = shiftedAmount.minus(r2.expected_amount || 0)

            if (isGoodBignumber(tokensAmountBN)) {
                this.changeData('tokensAmount', tokensAmountBN.shiftedBy(-this.token.decimals).toFixed())
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
            || !this.isTokensAmountValid
        ) {
            return
        }

        try {
            const {
                expected_amount: maxTotalTonsAmount,
            } = await this.pairContract.methods.expectedExchange({
                _answer_id: 0,
                amount: this.amountNumber
                    .shiftedBy(this.token.decimals)
                    .toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call()

            const maxTonsAmountBN = new BigNumber(maxTotalTonsAmount || 0)
                .times(new BigNumber(100).minus(maxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .shiftedBy(-DexConstants.TONDecimals)
                .minus(debt)
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
                }).call()

                const tonsAmountBN = new BigNumber(toExchangeAmount || 0)
                    .times(new BigNumber(100).minus(minSlippage))
                    .div(100)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .shiftedBy(-DexConstants.TONDecimals)
                    .minus(debt)
                    .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

                this.changeData('swapType', '0')

                const {
                    expected_amount: maxSpendTokens,
                } = await this.pairContract.methods.expectedSpendAmount({
                    _answer_id: 0,
                    receive_amount: debt
                        .plus(tonsAmountBN)
                        .times(100)
                        .div(new BigNumber(100).minus(maxSlippage))
                        .shiftedBy(DexConstants.TONDecimals)
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call()

                const minTokensAmountBN = this.amountNumber.shiftedBy(this.token.decimals).minus(maxSpendTokens)

                if (isGoodBignumber(minTokensAmountBN)) {
                    this.changeData('minReceiveTokens', minTokensAmountBN.toFixed())

                    if (isGoodBignumber(tonsAmountBN) || tonsAmountBN.isZero()) {
                        this.changeData('tonsAmount', tonsAmountBN.toFixed())
                    }
                }
                else {
                    this.changeData('tokensAmount', '0')
                    this.changeData('minReceiveTokens', '0')
                    this.changeData('swapType', '1')

                    if (isGoodBignumber(maxTonsAmountBN)) {
                        this.changeData('tonsAmount', maxTonsAmountBN.toFixed())
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
            || this.token === undefined
            || !this.isTonsAmountValid
        ) {
            return
        }

        try {
            const {
                expected_amount: maxSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: debt
                    .plus(this.tonsAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(maxSlippage))
                    .shiftedBy(DexConstants.TONDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call()

            const {
                expected_amount: minSpendTokens,
            } = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: debt
                    .plus(this.tonsAmountNumber)
                    .times(100)
                    .div(new BigNumber(100).minus(minSlippage))
                    .shiftedBy(DexConstants.TONDecimals)
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call()

            const minTokensAmountBN = this.amountNumber.shiftedBy(this.token.decimals).minus(maxSpendTokens || 0)

            if (isGoodBignumber(minTokensAmountBN)) {
                this.changeData('swapType', '0')
                this.changeData('minReceiveTokens', minTokensAmountBN.toFixed())
            }

            const tokensAmountBN = this.amountNumber
                .shiftedBy(this.token.decimals)
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
     * @param selectedToken
     * @protected
     */
    protected async handleChangeToken(selectedToken?: string): Promise<void> {
        if (selectedToken === undefined) {
            return
        }

        this.resetAsset()

        await this.syncToken()

        if (this.isEvmToTon && this.isCreditAvailable) {
            this.checkMinTons()
            this.checkSwapCredit()
            await this.syncPair()
            await this.syncMinAmount()
        }
    }

    /**
     *
     * @param enabled
     * @protected
     */
    protected async handleSwapToggle(enabled?: boolean): Promise<void> {
        if (!enabled) {
            this.changeData('depositType', 'default')
            this.changeData('tokensAmount', '')
            this.changeData('tonsAmount', '')
            return
        }

        this.changeData('depositType', 'credit')

        this.checkSwapCredit()
        this.checkMinTons()

        await this.syncToken()

        if (isGoodBignumber(this.amountNumber)) {
            await this.onChangeAmount()
        }
    }

    /**
     *
     * @param connected
     * @protected
     */
    protected handleEvmWalletConnection(connected?: boolean): void {
        if (connected) {
            if (this.isEvmToTon && !this.leftAddress) {
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
     * @param connected
     * @protected
     */
    protected async handleTonWalletConnection(connected?: boolean): Promise<void> {
        if (connected) {
            const tonNetwork = getTonMainNetwork()
            if (this.isEvmToTon && !this.rightAddress) {
                this.changeData('rightAddress', this.tonWallet.address || '')
                this.changeData('rightNetwork', tonNetwork)
            }
            else if (this.isTonToEvm && !this.leftAddress) {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('leftNetwork', tonNetwork)
            }

            this.checkSwapCredit()
            this.checkMinTons()

            await this.onChangeAmount()
        }
        else {
            this.changeState('isSwapEnabled', false)

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

    /**
     *
     * @protected
     */
    protected handleTonWalletBalance(): void {
        if (this.isEvmToTon) {
            this.checkSwapCredit()
        }
    }

    /**
     *
     * @protected
     */
    protected checkSwapCredit(): void {
        if (this.tonWallet.isConnected && this.isInsufficientTonBalance) {
            this.changeState('isSwapEnabled', this.isCreditAvailable)
        }
        else {
            this.changeData('minTonsAmount', '0')
        }
    }

    /**
     *
     * @protected
     */
    protected checkMinTons(): void {
        if (this.isInsufficientTonBalance && this.isSwapEnabled) {
            const isEnoughTonsAmount = this.tonsAmountNumber
                .shiftedBy(DexConstants.TONDecimals)
                .gte(this.data.minTonsAmount || 0)

            if (!isEnoughTonsAmount) {
                this.changeData(
                    'tonsAmount',
                    this.tonsAmountNumber
                        .shiftedBy(DexConstants.TONDecimals)
                        .plus(this.data.minTonsAmount || 0)
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
    protected async syncToken(): Promise<void> {
        if (this.token === undefined) {
            return
        }

        try {
            if (this.isTonToEvm) {
                await this.tokensCache.syncTonToken(this.token.root)
                this.changeData('balance', this.token?.balance)
                if (this.rightNetwork?.chainId !== undefined) {
                    await this.tokensCache.syncEvmToken(this.token.root, this.rightNetwork.chainId)
                }
            }
            else if (this.leftNetwork?.chainId !== undefined) {
                await this.tokensCache.syncEvmToken(this.token.root, this.leftNetwork.chainId)
                const tokenVault = this.tokensCache.getTokenVault(
                    this.token.root,
                    this.leftNetwork.chainId,
                    this.depositType,
                )
                this.changeData('balance', tokenVault?.balance)
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
    protected async syncMinAmount(): Promise<void> {
        if (
            this.data.pairAddress === undefined
            || this.pairContract === undefined
            || this.token === undefined
        ) {
            return
        }

        try {
            const creditFactory = new Contract(
                TokenAbi.CreditFactory,
                BridgeConstants.CreditFactoryAddress,
            )
            const { value0 } = await creditFactory.methods.getDetails({
                answerId: 0,
            }).call()

            const {
                expected_amount: minAmount,
            } = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: new BigNumber(BridgeConstants.CreditBody)
                    .plus(new BigNumber(value0.fee || 0))
                    .plus(this.data.minTonsAmount || 0)
                    .times(100)
                    .div(new BigNumber(100).minus(minSlippage))
                    .dp(0, BigNumber.ROUND_UP)
                    .toFixed(),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call()

            const minAmountBN = new BigNumber(minAmount || 0)

            if (isGoodBignumber(minAmountBN)) {
                this.changeData('minAmount', minAmountBN.toFixed())
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
    protected async syncMaxTokensAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.pairContract === undefined
            || this.token === undefined
        ) {
            return
        }

        try {

            const { expected_amount: minSpentTokens } = await this.pairContract.methods.expectedSpendAmount({
                _answer_id: 0,
                receive_amount: amountWithSlippage(
                    debt.plus(this.isInsufficientTonBalance ? this.tonsAmountNumber : 0),
                    minSlippage,
                ),
                receive_token_root: DexConstants.WTONRootAddress,
            }).call()

            const maxTokensAmount = this.amountNumber.shiftedBy(this.token.decimals).minus(minSpentTokens || 0)

            if (isGoodBignumber(maxTokensAmount)) {
                this.changeData('maxTokensAmount', maxTokensAmount.toFixed())
            }
        }
        catch (e) {
            error('Sync Tokens max amount error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected async syncMaxTonsAmount(): Promise<void> {
        if (
            !this.isSwapEnabled
            || this.pairContract === undefined
            || this.token === undefined
        ) {
            return
        }

        try {
            const {
                expected_amount: expectedAmount,
            } = await this.pairContract.methods.expectedExchange({
                _answer_id: 0,
                amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                spent_token_root: new Address(this.token.root),
            }).call()

            const tonsAmountBN = new BigNumber(expectedAmount || 0)
                .times(new BigNumber(100).minus(maxSlippage))
                .div(100)
                .dp(0, BigNumber.ROUND_DOWN)
                .minus(new BigNumber(debt).shiftedBy(DexConstants.TONDecimals))
                .dp(DexConstants.TONDecimals, BigNumber.ROUND_DOWN)

            this.changeData('maxTonsAmount', tonsAmountBN.toFixed())
        }
        catch (e) {
            error('Sync TONs max amount error', e)
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
        }
        catch (e) {
            error('Sync pair error', e)
        }
    }

    /**
     *
     * @protected
     */
    protected get pairContract(): Contract<typeof DexAbi.Pair> | undefined {
        return this.data.pairAddress !== undefined
            ? new Contract(DexAbi.Pair, this.data.pairAddress)
            : undefined
    }

    /**
     *
     */
    public async approve(): Promise<void> {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return
        }

        const tokenVault = this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            this.depositType,
        )

        if (tokenVault?.decimals === undefined) {
            return
        }

        const tokenContract = await this.tokensCache.getEthTokenContract(this.token.root, this.leftNetwork.chainId)

        if (tokenContract === undefined) {
            return
        }

        let result: unknown

        try {
            this.changeState('isPendingApproval', true)
            if (this.approvalStrategy === 'infinity') {
                result = await tokenContract.methods.approve(
                    tokenVault.vault,
                    '340282366920938463426481119284349108225',
                ).send({
                    from: this.evmWallet.address,
                    type: '0x00',
                })
            }
            else {
                result = await tokenContract.methods.approve(
                    tokenVault.vault,
                    this.amountNumber.shiftedBy(tokenVault.decimals).toFixed(),
                ).send({
                    from: this.evmWallet.address,
                    type: '0x00',
                })
            }

            this.changeState('step', CrosschainBridgeStep.TRANSFER)
        }
        catch (e) {
            error('Approve error', e)
        }
        finally {
            this.changeState('isPendingApproval', false)
        }

        debug('Approve result', result)
    }

    /**
     *
     */
    public async checkAllowance(): Promise<void> {
        if (this.token === undefined || this.leftNetwork?.chainId === undefined) {
            return
        }

        const tokenVault = this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            this.depositType,
        )

        if (tokenVault?.decimals === undefined) {
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
                tokenVault.vault,
            ).call()

            const delta = new BigNumber(allowance).minus(
                this.amountNumber.shiftedBy(tokenVault.decimals),
            )

            if (delta.lt(0)) {
                this.changeData('approvalDelta', delta.abs())
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
     *
     * @param reject
     */
    public async transfer(reject?: () => void): Promise<void> {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return
        }

        const tokenVault = this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            this.depositType,
        )

        if (tokenVault?.decimals === undefined) {
            return
        }

        const wrapperContract = this.tokensCache.getEthTokenVaultWrapperContract(
            this.token.root,
            this.leftNetwork.chainId,
        )

        if (wrapperContract === undefined) {
            return
        }

        const target = this.rightAddress.split(':')

        if (this.isSwapEnabled) {
            try {
                await wrapperContract.methods.depositToFactory(
                    this.amountNumber.shiftedBy(tokenVault.decimals).toFixed(),
                    '0',
                    `0x${target[1]}`,
                    BridgeConstants.DepositToFactoryAddress,
                    `0x${target[1]}`,
                    this.minReceiveTokensNumber.toFixed(),
                    this.tonsAmountNumber.shiftedBy(DexConstants.TONDecimals).toFixed(),
                    this.data.swapType,
                    '5', // numerator todo: to const DepositToFactoryMinSlippage
                    '100', // denominator
                    `0x${Buffer.from('te6ccgEBAQEAAgAAAA==', 'base64').toString('hex')}`,
                ).send({
                    from: this.evmWallet.address,
                    type: '0x00',
                }).once('transactionHash', (transactionHash: string) => {
                    this.changeData('txHash', transactionHash)
                })
            }
            catch (e) {
                reject?.()
                error('Transfer deposit error', e)
            }
        }
        else {
            try {
                await wrapperContract.methods.deposit(
                    [target[0], `0x${target[1]}`],
                    this.amountNumber.shiftedBy(tokenVault.decimals).toFixed(),
                ).send({
                    from: this.evmWallet.address,
                    type: '0x00',
                }).once('transactionHash', (transactionHash: string) => {
                    this.changeData('txHash', transactionHash)
                })
            }
            catch (e) {
                reject?.()
                error('Transfer deposit error', e)
            }
        }
    }

    /**
     *
     * @param reject
     */
    public async prepareTonToEvm(reject?: () => void): Promise<void> {
        if (
            this.rightNetwork?.chainId === undefined
            || !this.rightAddress
            || this.token === undefined
            || this.decimals === undefined
            || this.tonWallet.address === undefined
        ) {
            return
        }

        const tonConfigurationContract = await this.tokensCache.getTonConfigurationContract(this.token.root)

        if (tonConfigurationContract === undefined) {
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
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ] as const,
                data: {
                    chainId: this.rightNetwork.chainId,
                    addr: this.rightAddress,
                },
            })

            await walletContract.methods.burnByOwner({
                callback_address: new Address(this.token.proxy),
                callback_payload: data.boc,
                grams: '0',
                send_gas_to: new Address(this.tonWallet.address),
                tokens: this.amountNumber.shiftedBy(this.decimals).toFixed(),
            }).send({
                amount: '6000000000',
                bounce: true,
                from: new Address(this.leftAddress),
            })

            const eventAddress = await eventStream.first()

            // for redirect
            this.changeData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.()
            error('Prepare TON to EVM error', e)
            await subscriber.unsubscribe()
        }
    }

    /**
     *
     */
    public get amount(): CrosschainBridgeStoreData['amount'] {
        return this.data.amount
    }

    public get balance(): CrosschainBridgeStoreData['balance'] {
        return this.data.balance
    }

    public get depositType(): CrosschainBridgeStoreData['depositType'] {
        return this.data.depositType
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

    public get tokensAmount(): CrosschainBridgeStoreData['tokensAmount'] {
        return this.data.tokensAmount
    }

    public get minReceiveTokens(): CrosschainBridgeStoreData['minReceiveTokens'] {
        return this.data.minReceiveTokens
    }

    public get tonsAmount(): CrosschainBridgeStoreData['tonsAmount'] {
        return this.data.tonsAmount
    }

    public get txHash(): CrosschainBridgeStoreData['txHash'] {
        return this.data.txHash
    }

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

    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get minReceiveTokensNumber(): BigNumber {
        return new BigNumber(this.minReceiveTokens || 0)
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

        if (
            this.token === undefined
            || this.leftNetwork?.chainId === undefined
        ) {
            return undefined
        }

        return this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            this.depositType,
        )?.decimals
    }

    public get token(): TokenCache | undefined {
        if (this.data.selectedToken === undefined) {
            return undefined
        }

        if (this.isEvmToTon && this.leftNetwork !== undefined) {
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

    public get isAmountValid(): boolean {
        if (this.isSwapEnabled && isGoodBignumber(this.amountNumber)) {
            return (
                validateMinValue(this.data.minAmount, this.amount, this.decimals)
                && validateMaxValue(this.balance || '0', this.amount, this.decimals)
            )
        }
        return this.amount.length > 0
            ? validateMaxValue(this.balance || '0', this.amount, this.decimals)
            : true
    }

    public get isTokensAmountValid(): boolean {
        if (this.tokensAmount && isGoodBignumber(this.tokensAmountNumber, false)) {
            return (
                validateMinValue('0', this.tokensAmount, this.decimals)
                && validateMaxValue(this.data.maxTokensAmount, this.tokensAmount, this.decimals)
            )
        }
        return !this.tokensAmount ? true : isGoodBignumber(this.tokensAmountNumber)
    }

    public get isTonsAmountValid(): boolean {
        if (this.isInsufficientTonBalance) {
            return (
                validateMinValue(this.data.minTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
                && validateMaxValue(this.data.maxTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
            )
        }
        if (this.tonsAmount && isGoodBignumber(this.tonsAmountNumber, false)) {
            return (
                validateMinValue('0', this.tonsAmount, DexConstants.TONDecimals)
                && validateMaxValue(this.data.maxTonsAmount, this.tonsAmount, DexConstants.TONDecimals)
            )
        }
        return !this.tonsAmount ? true : isGoodBignumber(this.tonsAmountNumber)
    }

    public get isAssetValid(): boolean {
        return (
            this.evmWallet.isConnected
            && this.tonWallet.isConnected
            && this.data.selectedToken !== undefined
            && this.amount.length > 0
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
        const tokenVault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId, 'credit')
        return tokenVault !== undefined
    }

    public get isInsufficientTonBalance(): boolean {
        return new BigNumber(this.tonWallet.balance || 0).lt(BridgeConstants.CreditBody)
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

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useTonWallet(): TonWalletService {
        return this.tonWallet
    }

    public get useTokensCache(): TokensCacheService {
        return this.tokensCache
    }

    #gasFeesDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #tonWalletBalanceDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}
