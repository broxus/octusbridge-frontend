import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, Transaction } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import bs58 from 'bs58'
import { Address } from 'everscale-inpage-provider'
import isEqual from 'lodash.isequal'
import { action, computed, makeObservable, reaction, type IReactionDisposer } from 'mobx'
import * as uuid from 'uuid'

import initBridge, { depositSol } from '@/wasm/bridge'
import {
    Compounder,
    EventCloser,
    networks,
    EverSafeAmount,
    WEVEREvmRoots,
    WEVERRootAddress,
    WEVERVaultAddress,
    Unwrapper,
} from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import { BridgeUtils, EthAbi } from '@/misc'
import { erc20TokenContract, evmMultiVaultContract } from '@/misc/eth-contracts'
import {
    ethereumEventConfigurationContract,
    everscaleEventConfigurationContract,
    everSolEventConfigurationContract,
    getFullContractState,
    tokenWalletContract,
    wrappedCoinVaultContract,
} from '@/misc/contracts'
import { type EverscaleToken, EvmToken, Pipeline } from '@/models'
import {
    type CrosschainBridgeStoreData,
    type CrosschainBridgeStoreState,
    type NetworkFields,
    type PendingWithdrawal,
} from '@/modules/Bridge/types'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'
import {
    findAssociatedTokenAddress,
    getPrice,
    getUnwrapPayload,
    ixFromRust,
    type Tickers,
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
} from '@/utils'

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

export class CrosschainBridge extends BaseStore<CrosschainBridgeStoreData, CrosschainBridgeStoreState> {

    /*
     * Public actions. Useful in UI
     * ----------------------------------------------------------------------------------
     */

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly solanaWallet: SolanaWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
    ) {
        super()

        this.reset()

        makeObservable<
            CrosschainBridge,
            | 'handleEvmWalletConnection'
            | 'handleEverWalletConnection'
            | 'handleEverWalletBalance'
            | 'handleEvmPendingWithdrawal'
            | 'handleSolanaWalletConnection'
        >(this, {
            handleEvmWalletConnection: action.bound,
            handleEverWalletConnection: action.bound,
            handleEverWalletBalance: action.bound,
            handleEvmPendingWithdrawal: action.bound,
            handleSolanaWalletConnection: action.bound,
            amount: computed,
            maxEversAmount: computed,
            everscaleEvmCost: computed,
            evmEverscaleCost: computed,
            maxTransferFee: computed,
            minEversAmount: computed,
            minTransferFee: computed,
            eversAmount: computed,
            gasPrice: computed,
            leftAddress: computed,
            leftNetwork: computed,
            pipeline: computed,
            rightAddress: computed,
            rightNetwork: computed,
            txHash: computed,
            txPrice: computed,
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
            isAmountVaultLimitExceed: computed,
            isAmountMaxValueValid: computed,
            isAmountValid: computed,
            isEversAmountValid: computed,
            isAssetValid: computed,
            isRouteValid: computed,
            isInsufficientVaultBalance: computed,
            isEnoughWeverBalance: computed,
            isEnoughEverBalance: computed,
            isEnoughComboBalance: computed,
            isEverscaleBasedToken: computed,
            isEvmToEvm: computed,
            isEvmToEverscale: computed,
            isFromEvm: computed,
            isFromEverscale: computed,
            isFromSolana: computed,
            isEverscaleToEvm: computed,
            isEverscaleToSolana: computed,
            isNativeEverscaleCurrency: computed,
            isNativeEvmCurrency: computed,
            rightNetworks: computed,
            token: computed,
            vaultBalance: computed,
            vaultBalanceDecimals: computed,
            vaultLimitNumber: computed,
            tokens: computed,
            eversAmountNumber: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useBridgeAssets: computed,
            evmPendingWithdrawal: computed,
        })
    }

    public get everscaleEvmCost(): CrosschainBridgeStoreData['everscaleEvmCost'] {
        return this.data.everscaleEvmCost
    }

    public get evmEverscaleCost(): CrosschainBridgeStoreData['evmEverscaleCost'] {
        return this.data.evmEverscaleCost
    }

    public get gasPrice(): CrosschainBridgeStoreData['gasPrice'] {
        return this.data.gasPrice
    }

    public get txPrice(): CrosschainBridgeStoreData['txPrice'] {
        return this.data.txPrice
    }

    public get approvalStrategy(): CrosschainBridgeStoreState['approvalStrategy'] {
        return this.state.approvalStrategy
    }

    public get isSwapEnabled(): CrosschainBridgeStoreState['isSwapEnabled'] {
        return this.state.isSwapEnabled
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
        if (this.isFromEverscale && this.isNativeEverscaleCurrency) {
            return this.pipeline?.everscaleTokenBalance
        }
        return this.token?.balance
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
        if (this.isFromEverscale && this.isNativeEverscaleCurrency) {
            return this.everWallet.coin.decimals
        }
        return this.token?.decimals
    }

    public get isAmountMaxValueValid(): boolean {
        if (this.isFromEverscale && this.isNativeEverscaleCurrency) {
            return this.isEnoughWeverBalance || this.isEnoughEverBalance || this.isEnoughComboBalance
        }
        if (this.amount.length > 0 && isGoodBignumber(this.amountNumber)) {
            return validateMaxValue(this.balanceNumber.toFixed(), this.amountNumber.toFixed())
        }
        return true
    }

    public get isAmountValid(): boolean {
        if (this.amount.length === 0) {
            return true
        }

        return this.isAmountMaxValueValid && (this.isEvmToEverscale ? !this.isAmountVaultLimitExceed : true)
    }

    public get isEversAmountValid(): boolean {
        return this.eversAmountNumber.shiftedBy(this.everWallet.coin.decimals).lte(this.maxEversAmount || 0)
    }

    public get isAssetValid(): boolean {
        return (
            this.everWallet.isConnected
            && (this.evmWallet.isConnected || this.solanaWallet.isConnected)
            && this.data.selectedToken !== undefined
            && this.amount.length > 0
            && isGoodBignumber(this.amountNumber)
            && !this.pipeline?.isBlacklisted
            && (this.isSwapEnabled ? this.isAmountValid && this.isEversAmountValid : this.isAmountValid)
        )
    }

    public get isInsufficientEverBalance(): boolean {
        return new BigNumber(this.everWallet.balance || 0).lt(EverSafeAmount)
    }

    public get isInsufficientVaultBalance(): boolean {
        if (this.isEverscaleToSolana) {
            return new BigNumber(this.pipeline?.vaultBalance ?? 0)
                .shiftedBy(-(this.pipeline?.solanaTokenDecimals ?? 0))
                .lt(this.amountNumber)
        }
        if (this.isEvmToEvm) {
            return new BigNumber(this.hiddenBridgePipeline?.vaultBalance ?? 0)
                .shiftedBy(-(this.hiddenBridgePipeline?.evmTokenDecimals ?? 0))
                .lt(this.amountNumber)
        }
        return new BigNumber(this.pipeline?.vaultBalance ?? 0)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals ?? 0))
            .lt(this.amountNumber)
    }

    public get isEnoughWeverBalance(): boolean {
        return new BigNumber(this.token?.balance || 0).shiftedBy(-this.everWallet.coin.decimals).gte(this.amountNumber)
    }

    public get isEnoughEverBalance(): boolean {
        return new BigNumber(this.everWallet.balance || 0)
            .minus(this.isSwapEnabled ? this.minEversAmount ?? EverSafeAmount : EverSafeAmount)
            .shiftedBy(-this.everWallet.coin.decimals)
            .gte(this.amountNumber)
    }

    public get isEnoughComboBalance(): boolean {
        return new BigNumber(this.token?.balance || 0)
            .plus(this.everWallet.balance || 0)
            .minus(this.isSwapEnabled ? this.minEversAmount ?? EverSafeAmount : EverSafeAmount)
            .shiftedBy(-this.everWallet.coin.decimals)
            .gte(this.amountNumber)
    }

    public get evmTokenDecimals(): number | undefined {
        if (this.isFromEverscale && !this.pipeline?.isNative) {
            return this.token?.decimals
        }
        return this.isEvmToEvm ? this.hiddenBridgePipeline?.evmTokenDecimals : this.pipeline?.evmTokenDecimals
    }

    /*
     * Reactions handlers
     * ----------------------------------------------------------------------------------
     */

    public get isEverscaleBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'tvm'
    }

    public get isNativeEverscaleCurrency(): boolean {
        if (this.data.selectedToken) {
            return [
                ...WEVEREvmRoots.map(i => i.toLowerCase()),
                WEVERRootAddress.toString().toLowerCase(),
            ].includes(this.data.selectedToken.toLowerCase())
        }
        return false
    }

    public get isNativeEvmCurrency(): boolean {
        if (!this.isNativeEverscaleCurrency && this.data.selectedToken) {
            return this.bridgeAssets.isNativeCurrency(this.data.selectedToken)
        }
        return false
    }

    public get isEvmToEverscale(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'tvm'
    }

    public get amount(): CrosschainBridgeStoreData['amount'] {
        return this.data.amount
    }

    /*
     * Internal utilities methods
     * ----------------------------------------------------------------------------------
     */

    public get maxEversAmount(): CrosschainBridgeStoreData['maxEversAmount'] {
        return this.data.maxEversAmount
    }

    public get maxTransferFee(): CrosschainBridgeStoreData['maxTransferFee'] {
        return this.data.maxTransferFee
    }

    /*
     * Memoized store data values
     * ----------------------------------------------------------------------------------
     */

    /**
     * Returns non-shifted minimum receive EVER`s amount
     */
    public get minEversAmount(): CrosschainBridgeStoreData['minEversAmount'] {
        return this.data.minEversAmount
    }

    public get minTransferFee(): CrosschainBridgeStoreData['minTransferFee'] {
        return this.data.minTransferFee
    }

    public get isFromEverscale(): boolean {
        return this.leftNetwork?.type === 'tvm'
    }

    public get isEverscaleToEvm(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'evm'
    }

    /**
     * Returns non-shifted receive EVER`s amount
     */
    public get eversAmount(): CrosschainBridgeStoreData['eversAmount'] {
        return this.data.eversAmount
    }

    public get isEverscaleToSolana(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'solana'
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

    public get isSolanaToEverscale(): boolean {
        return this.leftNetwork?.type === 'solana' && this.rightNetwork?.type === 'tvm'
    }

    public get rightNetworks(): NetworkShape[] {
        if (this.leftNetwork?.type === 'evm') {
            return networks.filter(network => (this.rightNetwork === undefined
                    ? network.id !== this.leftNetwork?.id && network.type !== 'solana'
                    : true))
        }
        return networks
    }

    public get isCalculating(): CrosschainBridgeStoreState['isCalculating'] {
        return this.state.isCalculating
    }

    public get isFetching(): CrosschainBridgeStoreState['isFetching'] {
        return this.state.isFetching
    }

    /*
     * Memoized store state values
     * ----------------------------------------------------------------------------------
     */

    public get isLocked(): CrosschainBridgeStoreState['isLocked'] {
        return this.state.isLocked
    }

    public get isPendingAllowance(): CrosschainBridgeStoreState['isPendingAllowance'] {
        return this.state.isPendingAllowance
    }

    public get isPendingApproval(): CrosschainBridgeStoreState['isPendingApproval'] {
        return this.state.isPendingApproval
    }

    public get vaultLimitNumber(): BigNumber {
        return new BigNumber(this.pipeline?.vaultLimit || 0)
            .shiftedBy(this.pipeline?.evmTokenDecimals === undefined ? 0 : -this.pipeline.evmTokenDecimals)
            .shiftedBy(this.amountMinDecimals)
            .dp(0, BigNumber.ROUND_DOWN)
    }

    public get step(): CrosschainBridgeStoreState['step'] {
        return this.state.step
    }

    public get evmPendingWithdrawal(): CrosschainBridgeStoreState['evmPendingWithdrawal'] {
        return this.state.evmPendingWithdrawal
    }

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

    public get tokens(): BridgeAsset[] {
        const leftChainId = this.leftNetwork?.chainId
        const rightChainId = this.rightNetwork?.chainId

        if (this.isEvmToEvm && leftChainId !== undefined && rightChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(token => {
                const assetRoot = this.bridgeAssets.findAssetRootByTokenAndChain(token.root, leftChainId)
                const assets = this.bridgeAssets.assets[assetRoot ?? token.root]
                return (
                    isEvmAddressValid(token.root)
                    && token.chainId === leftChainId
                    && Object.entries({ ...assets }).some(([key, asset]) => {
                        const [tokenBase] = key.split('_')
                        return asset.vaults.some(
                            vault => vault.chainId === leftChainId && vault.depositType === 'credit' && tokenBase === 'evm',
                        )
                    })
                    && Object.entries({ ...assets }).some(([key, asset]) => {
                        const [tokenBase] = key.split('_')
                        return asset.vaults.some(
                            vault => vault.chainId === rightChainId
                                && vault.depositType === 'default'
                                && tokenBase === 'evm',
                        )
                    })
                )
            })
        }

        if (this.isFromEvm && leftChainId !== undefined) {
            return this.bridgeAssets.tokens.filter(
                token => isEvmAddressValid(token.root) && token.chainId === leftChainId,
            )
        }

        if (this.isEverscaleToSolana) {
            return this.bridgeAssets.tokens.filter(token => {
                const assets = this.bridgeAssets.assets[token.root]
                return Object.keys({ ...assets }).some(key => key.split('_')[0] === 'solana')
            })
        }

        if (this.isFromEverscale && leftChainId !== undefined) {
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

    /*
     * Computed states and values
     * ----------------------------------------------------------------------------------
     */

    /**
     * Returns shifted token balance BigNumber instance
     */
    public get balanceNumber(): BigNumber {
        return new BigNumber(this.balance || 0).shiftedBy(this.decimals ? -this.decimals : 0)
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

    public get depositFee(): string {
        if (this.isFromEvm) {
            return this.amountNumber
                .shiftedBy(this.pipeline?.evmTokenDecimals || 0)
                .times(this.pipeline?.depositFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.pipeline?.evmTokenDecimals || 0))
                .toFixed()
        }
        return '0'
    }

    public get withdrawFee(): string {
        if (this.isFromEverscale) {
            return this.amountNumber
                .shiftedBy(this.token?.decimals || 0)
                .times(this.pipeline?.withdrawFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.token?.decimals || 0))
                .toFixed()
        }
        return '0'
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

    public get isRouteValid(): boolean {
        let isValid = this.everWallet.isConnected
            && (this.evmWallet.isConnected || this.solanaWallet.isConnected)
            && this.leftNetwork !== undefined
            && this.leftAddress.length > 0
            && this.rightNetwork !== undefined
            && this.rightAddress.length > 0
            && this.bridgeAssets.isReady

        if (this.isFromEvm) {
            isValid = isValid
                && isEqual(this.leftNetwork?.chainId, this.evmWallet.chainId)
                && isEvmAddressValid(this.leftAddress)
        }

        if (this.isEvmToEvm) {
            isValid = false // isValid && isEvmAddressValid(this.rightAddress)
        }
        else if (this.isEvmToEverscale) {
            isValid = isValid && isEverscaleAddressValid(this.rightAddress)
        }
        else if (this.isEverscaleToEvm) {
            isValid = isValid
                && isEqual(this.rightNetwork?.chainId, this.evmWallet.chainId)
                && isEverscaleAddressValid(this.leftAddress)
                && isEvmAddressValid(this.rightAddress)
        }

        return isValid
    }

    public get isEvmToEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isFromEvm(): boolean {
        return this.leftNetwork?.type === 'evm'
    }

    public get isFromSolana(): boolean {
        return this.leftNetwork?.type === 'solana'
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
        if (this.isEverscaleToSolana) {
            return this.pipeline?.solanaTokenDecimals
        }
        return this.pipeline?.evmTokenDecimals
    }

    public get pendingWithdrawalsAmount(): string | undefined {
        return this.pendingWithdrawals?.reduce((acc, item) => acc.plus(item.amount), new BigNumber(0)).toFixed()
    }

    public get pendingWithdrawalsBounty(): string | undefined {
        return this.pendingWithdrawals?.reduce((acc, item) => acc.plus(item.bounty), new BigNumber(0)).toFixed()
    }

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
                this.setData('leftAddress', this.everWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.setData('leftAddress', this.evmWallet.address || '')
                if (this.rightNetwork?.type === 'solana') {
                    this.setData('rightNetwork', undefined)
                }
            }

            if (value.id === this.rightNetwork?.id) {
                this.setData({
                    rightNetwork: this.leftNetwork,
                    rightAddress: leftAddress,
                })
            }
        }
        else if (key === 'rightNetwork') {
            if (value.type === 'tvm') {
                this.setData('rightAddress', this.everWallet.address || '')
            }
            else if (value.type === 'evm') {
                this.setData('rightAddress', this.evmWallet.address || '')
            }

            if (value.id === this.leftNetwork?.id) {
                if (this.rightNetwork?.type === 'tvm') {
                    this.setData('leftAddress', this.everWallet.address || '')
                }
                else if (this.rightNetwork?.type === 'evm') {
                    this.setData('leftAddress', this.evmWallet.address || '')
                }

                this.setData('leftNetwork', this.rightNetwork)
            }
        }

        this.setData(key, value)
    }

    public async changeToken(address: string): Promise<void> {
        this.setData('selectedToken', address)

        this.resetAsset()

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
                this.isEvmToEvm
                    ? `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`
                    : `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            )

            if (pipeline === undefined) {
                this.setState('isLocked', true)
                return
            }

            this.setData('pipeline', new Pipeline(pipeline))
        }
        catch (e) {
            error(e)
            this.setState('isLocked', true)
        }
        finally {
            this.setState('isFetching', false)
            debug('Current pipeline', this.pipeline, this.hiddenBridgePipeline)
        }

        if (this.isFromEvm && this.isNativeEvmCurrency) {
            if (this.leftNetwork.chainId === this.evmWallet.chainId) {
                (this.token as EvmToken)?.setData('balance', this.evmWallet.balance)
                this.pipeline?.setData('evmTokenBalance', this.evmWallet.balance)
                this.pipeline?.setData('evmTokenDecimals', this.evmWallet.coin.decimals)
            }
        }
        else if (this.isFromEverscale && this.isNativeEverscaleCurrency) {
            this.pipeline?.setData(
                'everscaleTokenBalance',
                new BigNumber(this.everWallet.balance || 0).plus(this.token?.balance ?? 0).toFixed(),
            )
            this.pipeline?.setData('everscaleTokenDecimals', this.everWallet.coin.decimals)
        }

        await this.checkForceCreditSwap()

        await this.switchToCredit()
    }

    public async switchToCredit(): Promise<void> {
        this.setState('isSwapEnabled', true)

        try {
            this.setState('isCalculating', true)

            let eventInitialBalance = '6000000000'

            if (this.pipeline?.ethereumConfiguration !== undefined) {
                try {
                    eventInitialBalance = (
                        await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                            .methods.getDetails({
                                answerId: 0,
                            })
                            .call()
                    )._basicConfiguration.eventInitialBalance
                }
                catch (e) {}
            }

            let rate = '0'

            if (this.isFromEvm) {
                rate = (await getPrice(this.leftNetwork!.currencySymbol.toUpperCase() as Tickers)).price
            }
            else if (this.isFromEverscale) {
                rate = (await getPrice(this.rightNetwork!.currencySymbol.toUpperCase() as Tickers)).price
            }

            let gasUsage = 1_700_000

            // if token exists in evm
            if (this.pipeline?.evmTokenAddress) {
                if (this.pipeline.isNative) {
                    try {
                        const network = findNetwork(this.pipeline.chainId, 'evm')
                        if (network) {
                            await BridgeUtils.getEvmTokenSymbol(this.pipeline.evmTokenAddress, network.rpcUrl)
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

            const gasPrice = (await this.evmWallet.web3?.eth.getGasPrice().catch(() => '0')) ?? '0'
            const gasPriceNumber = new BigNumber(gasPrice || 0)
                .times(gasUsage)
                .shiftedBy(-this.evmWallet.coin.decimals)
                .times(rate)
                .times(1.2)
                .dp(this.everWallet.coin.decimals, BigNumber.ROUND_DOWN)
                .shiftedBy(this.everWallet.coin.decimals)

            this.setData({
                eventInitialBalance,
                everscaleEvmCost: gasPriceNumber
                    .plus(eventInitialBalance)
                    .shiftedBy(-this.everWallet.coin.decimals)
                    .toFixed(),
                evmEverscaleCost: gasPriceNumber
                    .plus(eventInitialBalance)
                    .shiftedBy(-this.everWallet.coin.decimals)
                    .div(rate)
                    .dp(this.evmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .toFixed(),
                gasPrice,
                minEversAmount: gasPriceNumber
                    .plus(eventInitialBalance)
                    .toFixed(),
            })

            if (this.isFromEvm) {
                const maxEversAmount = this.everWallet.balanceNumber
                    .minus(gasPriceNumber
                    .shiftedBy(-this.everWallet.coin.decimals))
                    .toFixed()
                this.setData('maxEversAmount', isGoodBignumber(maxEversAmount) ? maxEversAmount : '0')
            }
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
            eversAmount: undefined,
            maxEversAmount: undefined,
            minEversAmount: undefined,
        })
    }

    /**
     * Manually initiate store.
     * Run all necessary reaction subscribers.
     */
    public init(): VoidFunction {
        this.#everWalletDisposer = reaction(() => this.everWallet.isConnected, this.handleEverWalletConnection, {
            fireImmediately: true,
        })
        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, this.handleEvmWalletConnection, {
            fireImmediately: true,
        })
        this.#solanaWalletDisposer = reaction(() => this.solanaWallet.isConnected, this.handleSolanaWalletConnection)
        this.#everWalletBalanceDisposer = reaction(
            () => [this.everWallet.balance, this.everWallet.isContractUpdating],
            this.handleEverWalletBalance,
        )

        return () => this.dispose()
    }

    /**
     * Manually dispose of all reaction subscribers.
     * Reset all data to their defaults.
     */
    public dispose(): void {
        this.#evmWalletDisposer?.()
        this.#everWalletDisposer?.()
        this.#everWalletBalanceDisposer?.()
        this.#solanaWalletDisposer?.()
        this.reset()
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
                        type: transactionType,
                        gas,
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
                || this.everWallet.address === undefined
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

                let eventInitialBalance = '6000000000'

                if (this.pipeline?.ethereumConfiguration !== undefined) {
                    try {
                        eventInitialBalance = (
                            await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                                .methods.getDetails({
                                    answerId: 0,
                                })
                                .call()
                        )._basicConfiguration.eventInitialBalance
                    }
                    catch (e) {}
                }

                const amount = this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed()

                let payload: string | undefined,
                    { evmTokenAddress } = this.pipeline

                if (this.isNativeEverscaleCurrency) {
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
                        remainingGasTo: this.everWallet.address,
                    })

                    target = response.sendTo.split(':')
                    payload = Buffer.from(response.tokensTransferPayload, 'base64').toString('hex')
                }

                const expectedEvers = this.eversAmountNumber
                    .shiftedBy(this.everWallet.coin.decimals)
                    .plus(eventInitialBalance ?? 0)

                const rate = (await getPrice(
                    this.leftNetwork?.currencySymbol.toLowerCase() as Tickers,
                )).price as string

                const value = expectedEvers
                    .shiftedBy(-this.everWallet.coin.decimals)
                    .div(rate)
                    .times(1.2)
                    .shiftedBy(this.evmWallet.coin.decimals)
                    .dp(0, BigNumber.ROUND_DOWN)

                const r = vaultContract.methods.deposit([
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
                ])

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                        value: value.toFixed(),
                    })

                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
                        value: value.toFixed(),
                    }).once('transactionHash', (transactionHash: string) => {
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

                let eventInitialBalance = '6000000000'

                if (this.pipeline?.ethereumConfiguration !== undefined) {
                    try {
                        eventInitialBalance = (
                            await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                                .methods.getDetails({
                                    answerId: 0,
                                })
                                .call()
                        )._basicConfiguration.eventInitialBalance
                    }
                    catch (e) {}
                }

                const amount = this.amountNumber
                    .shiftedBy(this.pipeline.evmTokenDecimals)
                    .dp(0, BigNumber.ROUND_DOWN)
                    .toFixed()

                const expectedEvers = this.eversAmountNumber
                    .shiftedBy(this.everWallet.coin.decimals)
                    .plus(eventInitialBalance ?? 0)

                const r = vaultContract.methods.depositByNativeToken([
                    /* recipient */
                    [target[0], `0x${target[1]}`],
                    /* amount */
                    amount,
                    /* expected_evers */
                    this.isSwapEnabled ? expectedEvers.toFixed() : 0,
                    /* payload */
                    [],
                ])

                let value = this.amountNumber.shiftedBy(this.evmWallet.coin.decimals)

                if (this.isSwapEnabled) {
                    const rate = (await getPrice(
                        this.leftNetwork?.currencySymbol.toLowerCase() as Tickers,
                    )).price as string

                    value = value.plus(
                        expectedEvers
                            .shiftedBy(-this.everWallet.coin.decimals)
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

                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
                        value: value.toFixed(),
                    }).once('transactionHash', (transactionHash: string) => {
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
                || this.everWallet.address === undefined
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

                if (this.isNativeEverscaleCurrency) {
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
                        remainingGasTo: this.everWallet.address,
                    })

                    target = response.sendTo.split(':')
                    payload = Buffer.from(response.tokensTransferPayload, 'base64').toString('hex')
                }

                const r = vaultContract.methods.deposit([
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
                ])

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
     * - WEVER, QUBE, BRIDGE
     * - Token that base chainId is not equals to target EVM network chainId
     *
     * @param {(e: any) => void} reject
     * @returns {Promise<void>}
     */
    public async transferTvmNativeToken(reject?: (e: any) => void): Promise<void> {
        if (
            this.everWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.everWallet.account?.address === undefined
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
                        const checkEvmAddress = `0x${new BigNumber(event.data.recipient)
                            .toString(16)
                            .padStart(40, '0')}`

                        if (
                            [EventCloser.toString().toLowerCase(), this.leftAddress!.toLowerCase()].includes(
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
                        name: 'callback',
                        type: 'tuple',
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
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

            let eventInitialBalance = '6000000000'

            if (this.pipeline?.ethereumConfiguration !== undefined) {
                try {
                    eventInitialBalance = (
                        await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                        .methods.getDetails({
                            answerId: 0,
                        })
                        .call()
                    )._basicConfiguration.eventInitialBalance
                }
                catch (e) {}
            }

            let attachedAmount = new BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const rate = (await getPrice(
                    this.rightNetwork.currencySymbol.toLowerCase() as Tickers,
                )).price

                let gasUsage = 1_700_000

                // if token exists in evm
                if (this.pipeline.evmTokenAddress) {
                    try {
                        await BridgeUtils.getEvmTokenSymbol(
                            this.pipeline.evmTokenAddress,
                            this.rightNetwork.rpcUrl,
                        )
                        gasUsage = 500_000
                    }
                    catch (e) {
                        debug('Token not deployed => gas usage is ', gasUsage)
                    }
                }

                const gasPrice = (await this.evmWallet.web3?.eth.getGasPrice().catch(() => '0')) ?? '0'
                const gasPriceNumber = new BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.everWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.everWallet.coin.decimals)

                attachedAmount = gasPriceNumber.plus(eventInitialBalance)
            }

            const remainingGasTo = this.isSwapEnabled ? EventCloser : this.everWallet.account.address

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
                        root: evmTokenAddress,
                        decimals,
                        name,
                        symbol,
                        key,
                        chainId,
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
            this.everWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.everWallet.account?.address === undefined
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
                        const checkEvmAddress = `0x${new BigNumber(event.data.recipient)
                            .toString(16)
                            .padStart(40, '0')}`

                        if (
                            [
                                EventCloser.toString().toLowerCase(),
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
                        name: 'callback',
                        type: 'tuple',
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
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

            const remainingGasTo = this.isSwapEnabled ? EventCloser : this.everWallet.account.address

            const compounderPayload = await staticRpc.packIntoCell({
                data: {
                    to: this.pipeline.proxyAddress,
                    amount: this.amountNumber
                        .shiftedBy(this.everWallet.coin.decimals)
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

            let eventInitialBalance = '6000000000'

            if (this.pipeline?.ethereumConfiguration !== undefined) {
                try {
                    eventInitialBalance = (
                        await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                        .methods.getDetails({
                            answerId: 0,
                        })
                        .call()
                    )._basicConfiguration.eventInitialBalance
                }
                catch (e) {}
            }

            let attachedAmount = new BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const rate = (await getPrice(
                    this.rightNetwork.currencySymbol.toLowerCase() as Tickers,
                )).price

                let gasUsage = 1_700_000

                if (this.pipeline?.evmTokenAddress) {
                    try {
                        const network = findNetwork(this.pipeline.chainId, 'evm')
                        if (network) {
                            await BridgeUtils.getEvmTokenSymbol(this.pipeline.evmTokenAddress, network.rpcUrl)
                            gasUsage = 500_000
                        }
                    }
                    catch (e) {
                        debug('Token not deployed => gas usage is ', gasUsage)
                    }
                }

                const gasPrice = (await this.evmWallet.web3?.eth.getGasPrice().catch(() => '0')) ?? '0'
                const gasPriceNumber = new BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.everWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.everWallet.coin.decimals)

                attachedAmount = gasPriceNumber.plus(eventInitialBalance)
            }

            const delta = this.amountNumber
                .shiftedBy(this.everWallet.coin.decimals)
                .minus(this.token.balance ?? 0)
                .toFixed()

            await walletContract.methods
                .transfer({
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
            this.everWallet.address === undefined
            || this.rightNetwork?.chainId === undefined
            || this.token === undefined
            || this.pipeline?.everscaleConfiguration === undefined
            || this.everWallet.account?.address === undefined
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
                        const checkEvmAddress = `0x${new BigNumber(event.data.recipient)
                            .toString(16)
                            .padStart(40, '0')}`

                        if (
                            [
                                EventCloser.toString().toLowerCase(),
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
                        name: 'callback',
                        type: 'tuple',
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
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

            const remainingGasTo = this.isSwapEnabled ? EventCloser : this.everWallet.account.address

            const compounderPayload = await staticRpc.packIntoCell({
                data: {
                    to: this.pipeline.proxyAddress,
                    amount: this.amountNumber.shiftedBy(this.everWallet.coin.decimals).toFixed(),
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

            let eventInitialBalance = '6000000000'

            if (this.pipeline?.ethereumConfiguration !== undefined) {
                try {
                    eventInitialBalance = (
                        await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                            .methods.getDetails({
                                answerId: 0,
                            })
                            .call()
                    )._basicConfiguration.eventInitialBalance
                }
                catch (e) {}
            }

            let attachedAmount = new BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const rate = (await getPrice(
                    this.rightNetwork.currencySymbol.toLowerCase() as Tickers,
                )).price

                let gasUsage = 1_700_000

                // if token exists in evm
                if (this.pipeline.evmTokenAddress) {
                    try {
                        await BridgeUtils.getEvmTokenSymbol(
                            this.pipeline.evmTokenAddress,
                            this.rightNetwork.rpcUrl,
                        )
                        gasUsage = 500_000
                    }
                    catch (e) {
                        debug('Token not deployed => gas usage is ', gasUsage)
                    }
                }

                const gasPrice = (await this.evmWallet.web3?.eth.getGasPrice().catch(() => '0')) ?? '0'
                const gasPriceNumber = new BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.everWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.everWallet.coin.decimals)

                attachedAmount = this.amountNumber
                    .shiftedBy(this.everWallet.coin.decimals)
                    .plus(gasPriceNumber.plus(eventInitialBalance))
                    .dp(0, BigNumber.ROUND_UP)
            }

            await WEVERVault.methods
                .wrap({
                    tokens: this.amountNumber.shiftedBy(this.everWallet.coin.decimals).toFixed(),
                    owner_address: Compounder,
                    gas_back_address: remainingGasTo,
                    payload: compounderPayload.boc,
                })
                .send({
                    amount: attachedAmount.toFixed(),
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
     * Burn TVM-alien token and mint it into EVM
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
            this.everWallet.account?.address === undefined
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

                        const checkEvmAddress = `0x${new BigNumber(event.data.recipient)
                            .toString(16)
                            .padStart(40, '0')}`

                        const addr = `0x${new BigNumber(
                            `0x${Buffer.from(event.data.callback_payload, 'base64').toString('hex')}`,
                        ).toString(16)}`

                        if (
                            [EventCloser.toString().toLowerCase(), this.leftAddress!.toLowerCase()].includes(
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

            let eventInitialBalance = '6000000000'

            if (this.pipeline?.ethereumConfiguration !== undefined) {
                try {
                    eventInitialBalance = (
                        await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                            .methods.getDetails({
                                answerId: 0,
                            })
                            .call()
                    )._basicConfiguration.eventInitialBalance
                }
                catch (e) {}
            }

            let attachedAmount = new BigNumber(eventInitialBalance)

            if (this.isSwapEnabled) {
                const rate = (await getPrice(this.rightNetwork.currencySymbol.toLowerCase() as Tickers)).price

                const gasUsage = 600_000
                const gasPrice = (await this.evmWallet.web3?.eth.getGasPrice().catch(() => '0')) ?? '0'
                const gasPriceNumber = new BigNumber(gasPrice || 0)
                    .times(gasUsage)
                    .shiftedBy(-this.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2) // +20%
                    .dp(this.everWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(this.everWallet.coin.decimals)

                attachedAmount = gasPriceNumber.plus(eventInitialBalance)
            }

            const remainingGasTo = this.isSwapEnabled ? EventCloser : this.everWallet.account.address

            const { mergePoolAddress, mergeEverscaleTokenAddress } = this.pipeline

            if (mergePoolAddress !== undefined && mergeEverscaleTokenAddress !== undefined) {
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
                            name: 'callback',
                            type: 'tuple',
                            components: [
                                { name: 'recipient', type: 'uint160' },
                                { name: 'payload', type: 'cell' },
                                { name: 'strict', type: 'bool' },
                            ] as const,
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
                        type: 0,
                        targetToken: mergeEverscaleTokenAddress,
                        operationPayload: payload.boc,
                    },
                    structure: [
                        { name: 'nonce', type: 'uint32' },
                        { name: 'type', type: 'uint8' },
                        { name: 'targetToken', type: 'address' },
                        { name: 'operationPayload', type: 'cell' },
                    ] as const,
                })

                await walletContract.methods
                    .burn({
                        callbackTo: mergePoolAddress,
                        payload: data.boc,
                        remainingGasTo,
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    })
                    .send({
                        amount: attachedAmount.toFixed(),
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }
            else if (this.token.root && this.bridgeAssets.isNativeCurrency(this.token.root)) {
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
                            name: 'callback',
                            type: 'tuple',
                            components: [
                                { name: 'recipient', type: 'uint160' },
                                { name: 'payload', type: 'bytes' },
                                { name: 'strict', type: 'bool' },
                            ] as const,
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

                await walletContract.methods
                    .burn({
                        callbackTo: this.pipeline.proxyAddress,
                        payload: data.boc,
                        remainingGasTo,
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    })
                    .send({
                        amount: attachedAmount.toFixed(),
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }
            else {
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
                            name: 'callback',
                            type: 'tuple',
                            components: [
                                { name: 'recipient', type: 'uint160' },
                                { name: 'payload', type: 'cell' },
                                { name: 'strict', type: 'bool' },
                            ] as const,
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

                await walletContract.methods
                    .burn({
                        callbackTo: this.pipeline.proxyAddress,
                        payload: data.boc,
                        remainingGasTo,
                        amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    })
                    .send({
                        amount: attachedAmount.toFixed(),
                        bounce: true,
                        from: new Address(this.leftAddress),
                    })
            }

            const eventAddress = await eventStream

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
                        root: evmTokenAddress,
                        decimals,
                        name,
                        symbol,
                        key,
                        chainId,
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
     *
     * @param reject
     */
    public async prepareEverscaleToSolana(reject?: (e: any) => void): Promise<void> {
        if (
            this.everWallet.account?.address === undefined
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
                            Buffer.from(new BigNumber(event.data.solanaOwnerAddress).toString(16), 'hex'),
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

            let account = (await this.solanaWallet.connection.getParsedTokenAccountsByOwner(
                rightAddressKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                },
            )).value.filter(
                item => this.pipeline?.solanaTokenAddress?.equals(
                    new PublicKey(item.account.data.parsed.info.mint),
                ),
            ).sort(
                (a, b) => a.account.data.parsed.info.tokenAmount.uiAmount
                    - b.account.data.parsed.info.tokenAmount.uiAmount,
            ).pop()?.pubkey

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

            const burnPayload = await staticRpc.packIntoCell({
                structure: [
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                    {
                        name: 'executeAccounts',
                        type: 'tuple[]',
                        components: [
                            { name: 'account', type: 'uint256' },
                            { name: 'readOnly', type: 'bool' },
                            { name: 'isSigner', type: 'bool' },
                        ] as const,
                    },
                ] as const,
                data: {
                    solanaOwnerAddress: `0x${Buffer.from(rightAddressKey.toBuffer()).toString('hex')}`,
                    executeAccounts,
                },
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

            await tokenWalletContract((this.token as EverscaleToken).wallet as Address)
                .methods.burn({
                    amount: this.amountNumber.shiftedBy(this.token.decimals).toFixed(),
                    callbackTo: this.pipeline.proxyAddress,
                    payload: data.boc,
                    remainingGasTo: this.everWallet.account.address,
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
            const account = (await this.solanaWallet.connection.getParsedTokenAccountsByOwner(
                this.solanaWallet.publicKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                },
            )).value.filter(
                item => this.pipeline?.solanaTokenAddress?.equals(
                    new PublicKey(item.account.data.parsed.info.mint),
                ),
            ).sort(
                (a, b) => a.account.data.parsed.info.tokenAmount.uiAmount
                    - b.account.data.parsed.info.tokenAmount.uiAmount,
            ).pop()

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

    /**
     *
     */
    public resetAsset(): void {
        this.setData({
            amount: '',
            bridgeFee: undefined,
            eversAmount: undefined,
            hiddenBridgePipeline: undefined,
            maxEversAmount: undefined,
            minEversAmount: undefined,
            minTransferFee: undefined,
            pipeline: undefined,
            txPrice: undefined,
        })
        this.setState({
            isCalculating: false,
            isFetching: false,
            isLocked: false,
            isSwapEnabled: false,
            isPendingAllowance: false,
            // isTokenChainSameToTargetChain: false,
        })
    }

    /**
     *
     * @param connected
     * @protected
     */
    protected async handleSolanaWalletConnection(connected?: boolean): Promise<void> {
        if (this.state.isProcessing) {
            return
        }

        if (connected) {
            if (this.leftNetwork?.type === 'solana') {
                this.setData('leftAddress', this.solanaWallet.address ?? '')
            }
            if (this.rightNetwork?.type === 'solana' && !this.rightAddress) {
                this.setData('rightAddress', this.solanaWallet.address ?? '')
            }
        }
        else {
            this.resetAsset()
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
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

    public get eversAmountNumber(): BigNumber {
        return new BigNumber(this.eversAmount || 0)
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useSolanaWallet(): SolanaWalletService {
        return this.solanaWallet
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
                    withdrawalIds.map(item => (
                        vaultContract
                            .methods.pendingWithdrawals(item.recipient, item.id)
                            .call()
                    )),
                )
            ).map((item, idx) => ({
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
     * @param connected
     * @protected
     */
    protected async handleEvmWalletConnection(connected?: boolean): Promise<void> {
        if (this.state.isProcessing) {
            return
        }

        if (connected) {
            if (this.isEvmToEverscale) {
                this.setData({
                    leftAddress: this.evmWallet.address ?? '',
                    rightAddress: this.everWallet.address ?? '',
                })
            }
            else if (this.isEverscaleToEvm) {
                this.setData({
                    leftAddress: this.everWallet.address ?? '',
                    rightAddress: this.evmWallet.address ?? '',
                })
            }
        }
        else {
            this.resetAsset()
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }

    /**
     *
     * @protected
     */
    protected async handleEverWalletBalance(): Promise<void> {
        await this.checkForceCreditSwap()
    }

    /**
     *
     * @param connected
     * @protected
     */
    protected async handleEverWalletConnection(connected?: boolean): Promise<void> {
        if (this.state.isProcessing) {
            return
        }

        if (connected) {
            if (this.isEvmToEverscale) {
                this.setData({
                    leftAddress: this.evmWallet.address ?? '',
                    rightAddress: this.everWallet.address ?? '',
                })
            }
            else if (this.isEverscaleToEvm) {
                this.setData({
                    leftAddress: this.everWallet.address ?? '',
                    rightAddress: this.evmWallet.address ?? '',
                })
            }
            if (this.data.selectedToken) {
                await this.changeToken(this.data.selectedToken).catch(error)
            }
        }
        else {
            // @ts-ignore
            this.token?.setData('balance', undefined)
            this.resetAsset()
            this.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
        }
    }

    #everWalletBalanceDisposer: IReactionDisposer | undefined

    #everWalletDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #solanaWalletDisposer: IReactionDisposer | undefined

    /**
     *
     * @protected
     */
    protected async checkForceCreditSwap(): Promise<void> {
        if (!this.isInsufficientEverBalance) {
            return
        }

        const { isConnected, isContractUpdating } = this.everWallet

        if (isConnected && !isContractUpdating) {
            switch (true) {
                case this.isEverscaleToEvm || this.isEvmToEverscale:
                    await this.switchToCredit()
                    break

                default:
            }
        }
    }

}
