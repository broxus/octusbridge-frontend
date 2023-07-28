import { action, computed, makeObservable } from 'mobx'

import { WEVEREvmRoots, WEVERRootAddress } from '@/config'
import { type Pipeline } from '@/models'
import { type PendingWithdrawal } from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAsset, type BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { type NetworkShape } from '@/types'

export type TransferSummaryData = {
    amount?: string
    bridgeFee?: string
    depositType?: string
    depositFee?: string
    evmTvmCost?: string
    expectedEversAmount?: string
    gasPrice?: string
    leftAddress?: string
    leftNetwork?: NetworkShape
    maxTransferFee?: string
    minTransferFee?: string
    pipeline?: Pipeline
    rightAddress?: string
    rightNetwork?: NetworkShape
    token?: BridgeAsset
    withdrawFee?: string
    pendingWithdrawals?: PendingWithdrawal[]
    tvmAddress?: string
    tvmEvmCost?: string
    txAddress: string
    secondPipeline?: Pipeline
    secondDepositFee?: string
    secondWithdrawFee?: string
    success?: boolean
}

export type TransferSummaryState = {
    isTransferPage?: boolean
    isTransferReleased?: boolean
}

export class TransferSummary extends BaseStore<TransferSummaryData, TransferSummaryState> {

    constructor(protected readonly bridgeAssets: BridgeAssetsService) {
        super()

        this.reset()

        makeObservable<TransferSummary>(this, {
            amount: computed,
            bridgeFee: computed,
            evmTokenDecimals: computed,
            evmTvmCost: computed,
            expectedEversAmount: computed,
            gasPrice: computed,
            isEvmEvm: computed,
            isEvmTvm: computed,
            isFromTvm: computed,
            isNativeEvmCurrency: computed,
            isNativeTvmCurrency: computed,
            isSolanaTvm: computed,
            isTransferPage: computed,
            isTransferReleased: computed,
            isTvmBasedToken: computed,
            isTvmEvm: computed,
            isTvmSolana: computed,
            leftAddress: computed,
            leftNetwork: computed,
            maxTransferFee: computed,
            minTransferFee: computed,
            pipeline: computed,
            reset: action,
            rightAddress: computed,
            rightNetwork: computed,
            solanaTokenDecimals: computed,
            success: computed,
            token: computed,
            tvmAddress: computed,
            tvmEvmCost: computed,
            txAddress: computed,
            vaultBalance: computed,
            vaultBalanceDecimals: computed,
        })
    }

    public reset(): void {
        this.setData(() => ({}))
        this.setState(() => ({ isTransferPage: false }))
    }

    public get amount(): TransferSummaryData['amount'] {
        return this.data.amount
    }

    public get expectedEversAmount(): TransferSummaryData['expectedEversAmount'] {
        return this.data.expectedEversAmount
    }

    public get bridgeFee(): TransferSummaryData['bridgeFee'] {
        return this.data.bridgeFee
    }

    public get tvmAddress(): TransferSummaryData['tvmAddress'] {
        return this.data.tvmAddress
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

    public get secondDepositFee(): TransferSummaryData['secondDepositFee'] {
        return this.data.secondDepositFee
    }

    public get secondWithdrawFee(): TransferSummaryData['secondWithdrawFee'] {
        return this.data.secondWithdrawFee
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

    public get secondPipeline(): TransferSummaryData['secondPipeline'] {
        return this.data.secondPipeline
    }

    public get token(): TransferSummaryData['token'] {
        return this.data.token
    }

    public get gasPrice(): TransferSummaryData['gasPrice'] {
        return this.data.gasPrice
    }

    public get tvmEvmCost(): TransferSummaryData['tvmEvmCost'] {
        return this.data.tvmEvmCost
    }

    public get evmTvmCost(): TransferSummaryData['evmTvmCost'] {
        return this.data.evmTvmCost
    }

    public get isTransferPage(): TransferSummaryState['isTransferPage'] {
        return this.state.isTransferPage
    }

    public get isTransferReleased(): TransferSummaryState['isTransferReleased'] {
        return this.state.isTransferReleased
    }

    public get vaultBalance(): string | undefined {
        if (this.isEvmEvm) {
            return this.secondPipeline?.vaultBalance
        }
        return this.pipeline?.vaultBalance
    }

    public get vaultBalanceDecimals(): number | undefined {
        if (this.isTvmSolana || this.isSolanaTvm) {
            return this.pipeline?.solanaTokenDecimals
        }
        if (this.isEvmEvm) {
            return this.secondPipeline?.evmTokenDecimals
        }
        return this.pipeline?.evmTokenDecimals
    }

    public get evmTokenDecimals(): number | undefined {
        return this.pipeline?.evmTokenDecimals
    }

    public get solanaTokenDecimals(): number | undefined {
        return this.pipeline?.solanaTokenDecimals
    }

    public get isTvmBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'tvm'
    }

    public get isNativeTvmCurrency(): boolean {
        if (this.data.token) {
            return [...WEVEREvmRoots, WEVERRootAddress.toString()].includes(this.data.token.root)
        }
        return false
    }

    public get isNativeEvmCurrency(): boolean {
        if (this.data.token && !this.isNativeTvmCurrency && this.data.token.root) {
            return this.bridgeAssets.isNativeCurrency(this.data.token.root)
        }
        return false
    }

    public get isEvmEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isEvmTvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'tvm'
    }

    public get isFromTvm(): boolean {
        return this.leftNetwork?.type === 'tvm'
    }

    public get isFromEvm(): boolean {
        return this.leftNetwork?.type === 'evm'
    }

    public get isTvmEvm(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'evm'
    }

    public get isTvmSolana(): boolean {
        return this.leftNetwork?.type === 'tvm' && this.rightNetwork?.type === 'solana'
    }

    public get isSolanaTvm(): boolean {
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
