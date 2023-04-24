import { action, computed, makeObservable } from 'mobx'

import { WEVEREvmRoots, WEVERRootAddress } from '@/config'
import { type PendingWithdrawal, type TransferSummaryData, type TransferSummaryState } from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAssetsService } from '@/stores/BridgeAssetsService'


export class TransferSummary extends BaseStore<TransferSummaryData, TransferSummaryState> {

    constructor(protected readonly bridgeAssets: BridgeAssetsService) {
        super()

        this.reset()

        makeObservable<TransferSummary>(this, {
            amount: computed,
            eversAmount: computed,
            bridgeFee: computed,
            gasPrice: computed,
            everscaleEvmCost: computed,
            evmEverscaleCost: computed,
            everscaleAddress: computed,
            maxTransferFee: computed,
            minTransferFee: computed,
            leftAddress: computed,
            leftNetwork: computed,
            rightAddress: computed,
            rightNetwork: computed,
            pipeline: computed,
            swapAmount: computed,
            token: computed,
            tokenAmount: computed,
            isTransferPage: computed,
            isTransferReleased: computed,
            vaultBalance: computed,
            vaultBalanceDecimals: computed,
            txAddress: computed,
            evmTokenDecimals: computed,
            solanaTokenDecimals: computed,
            isEverscaleBasedToken: computed,
            isEvmToEvm: computed,
            isEvmToEverscale: computed,
            isFromEverscale: computed,
            isEverscaleToEvm: computed,
            isEverscaleToSolana: computed,
            isSolanaToEverscale: computed,
            isNativeEverscaleCurrency: computed,
            isNativeEvmCurrency: computed,
            reset: action,
            success: computed,
        })
    }

    public reset(): void {
        this.setData(() => ({}))
        this.setState(() => ({ isTransferPage: false }))
    }

    public get amount(): TransferSummaryData['amount'] {
        return this.data.amount
    }

    public get eversAmount(): TransferSummaryData['eversAmount'] {
        return this.data.eversAmount
    }

    public get bridgeFee(): TransferSummaryData['bridgeFee'] {
        return this.data.bridgeFee
    }

    public get everscaleAddress(): TransferSummaryData['everscaleAddress'] {
        return this.data.everscaleAddress
    }

    public get maxTransferFee(): TransferSummaryData['maxTransferFee'] {
        return this.data.maxTransferFee
    }

    public get minTransferFee(): TransferSummaryData['minTransferFee'] {
        return this.data.minTransferFee
    }

    public get depositFee(): TransferSummaryData['depositFee'] {
        return this.data.depositFee
    }

    public get withdrawFee(): TransferSummaryData['withdrawFee'] {
        return this.data.withdrawFee
    }

    public get leftAddress(): TransferSummaryData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): TransferSummaryData['leftNetwork'] {
        return this.data.leftNetwork
    }

    public get rightAddress(): TransferSummaryData['rightAddress'] {
        return this.data.rightAddress
    }

    public get rightNetwork(): TransferSummaryData['rightNetwork'] {
        return this.data.rightNetwork
    }

    public get pipeline(): TransferSummaryData['pipeline'] {
        return this.data.pipeline
    }

    public get hiddenBridgePipeline(): TransferSummaryData['hiddenBridgePipeline'] {
        return this.data.hiddenBridgePipeline
    }

    public get swapAmount(): TransferSummaryData['swapAmount'] {
        return this.data.swapAmount
    }

    public get token(): TransferSummaryData['token'] {
        return this.data.token
    }

    public get tokenAmount(): TransferSummaryData['tokenAmount'] {
        return this.data.tokenAmount
    }

    public get gasPrice(): TransferSummaryData['gasPrice'] {
        return this.data.gasPrice
    }

    public get everscaleEvmCost(): TransferSummaryData['everscaleEvmCost'] {
        return this.data.everscaleEvmCost
    }

    public get evmEverscaleCost(): TransferSummaryData['evmEverscaleCost'] {
        return this.data.evmEverscaleCost
    }

    public get isTransferPage(): TransferSummaryState['isTransferPage'] {
        return this.state.isTransferPage
    }

    public get isTransferReleased(): TransferSummaryState['isTransferReleased'] {
        return this.state.isTransferReleased
    }

    public get vaultBalance(): string | undefined {
        if (this.isEvmToEvm) {
            return this.hiddenBridgePipeline?.vaultBalance
        }
        return this.pipeline?.vaultBalance
    }

    public get vaultBalanceDecimals(): number | undefined {
        if (this.isEverscaleToSolana || this.isSolanaToEverscale) {
            return this.pipeline?.solanaTokenDecimals
        }
        if (this.isEvmToEvm) {
            return this.hiddenBridgePipeline?.evmTokenDecimals
        }
        return this.pipeline?.evmTokenDecimals
    }

    public get evmTokenDecimals(): number | undefined {
        return this.pipeline?.evmTokenDecimals
    }

    public get solanaTokenDecimals(): number | undefined {
        return this.pipeline?.solanaTokenDecimals
    }

    public get isEverscaleBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'tvm'
    }

    public get isNativeEverscaleCurrency(): boolean {
        if (this.data.token) {
            return [...WEVEREvmRoots, WEVERRootAddress.toString()].includes(this.data.token.root)
        }
        return false
    }

    public get isNativeEvmCurrency(): boolean {
        if (this.data.token && !this.isNativeEverscaleCurrency && this.data.token.root) {
            return this.bridgeAssets.isNativeCurrency(this.data.token.root)
        }
        return false
    }

    public get isEvmToEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isEvmToEverscale(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'tvm'
    }

    public get isFromEverscale(): boolean {
        return this.leftNetwork?.type === 'tvm'
    }

    public get isFromEvm(): boolean {
        return this.leftNetwork?.type === 'evm'
    }

    public get isEverscaleToEvm(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'evm'
    }

    public get isEverscaleToSolana(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'solana'
    }

    public get isSolanaToEverscale(): boolean {
        return this.leftNetwork?.type === 'solana' && this.rightNetwork?.type === 'tvm'
    }

    public get pendingWithdrawals(): PendingWithdrawal[] | undefined {
        return this.data.pendingWithdrawals
    }

    public get txAddress(): TransferSummaryData['txAddress'] {
        return this.data.txAddress
    }

    public get success(): boolean {
        return !!this.data.success
    }

}
