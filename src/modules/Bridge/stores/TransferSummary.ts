import { makeObservable, observable } from 'mobx'

import {
    DEFAULT_TRANSFER_SUMMARY_STORE_DATA,
    DEFAULT_TRANSFER_SUMMARY_STORE_STATE,
} from '@/modules/Bridge/constants'
import { TransferSummaryData, TransferSummaryState } from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { Pipeline, TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'


export class TransferSummary extends BaseStore<TransferSummaryData, TransferSummaryState> {

    constructor(protected readonly tokensCache: TokensCacheService) {
        super()

        this.reset()

        makeObservable<TransferSummary, 'data' | 'state'>(this, {
            data: observable,
            state: observable,
        })
    }

    public reset(): void {
        this.setData(DEFAULT_TRANSFER_SUMMARY_STORE_DATA)
        this.setState(DEFAULT_TRANSFER_SUMMARY_STORE_STATE)
    }

    public get amount(): TransferSummaryData['amount'] {
        return this.data.amount
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

        return this.tokensCache.pipeline(
            this.token.root,
            `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
            `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            // this.depositType,
        )
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

    public get isTransferPage(): TransferSummaryState['isTransferPage'] {
        return this.state.isTransferPage
    }

    public get isTransferReleased(): TransferSummaryState['isTransferReleased'] {
        return this.state.isTransferReleased
    }

    public get vaultBalance(): string | undefined {
        return this.pipeline?.vaultBalance
    }

    public get evmTokenDecimals(): number | undefined {
        return this.pipeline?.evmTokenDecimals
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

    public get isFromEverscale(): boolean {
        return this.leftNetwork?.type === 'everscale'
    }

    public get isEverscaleToEvm(): boolean {
        return this.leftNetwork?.type === 'everscale' && this.rightNetwork?.type === 'evm'
    }

}

const TransferSummaryStore = new TransferSummary(useTokensCache())

export function useSummary(): TransferSummary {
    return TransferSummaryStore
}
