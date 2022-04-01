import { computed, makeObservable, runInAction } from 'mobx'

import {
    DEFAULT_TRANSFER_SUMMARY_STORE_DATA,
    DEFAULT_TRANSFER_SUMMARY_STORE_STATE,
} from '@/modules/Bridge/constants'
import { TransferSummaryData, TransferSummaryState } from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { Pipeline, TokensAssetsService } from '@/stores/TokensAssetsService'
import { getEverscaleMainNetwork } from '@/utils'


export class TransferSummary extends BaseStore<TransferSummaryData, TransferSummaryState> {

    constructor(protected readonly tokensCache: TokensAssetsService) {
        super()

        this.reset()

        makeObservable<TransferSummary>(this, {
            amount: computed,
            bridgeFee: computed,
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
            evmTokenDecimals: computed,
            isEverscaleBasedToken: computed,
            isEvmToEvm: computed,
            isEvmToEverscale: computed,
            isFromEverscale: computed,
            isEverscaleToEvm: computed,
        })
    }

    public reset(): void {
        runInAction(() => {
            this.data = DEFAULT_TRANSFER_SUMMARY_STORE_DATA
            this.state = DEFAULT_TRANSFER_SUMMARY_STORE_STATE
        })
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
            (this.isEvmToEvm && this.isTransferPage) ? 'default' : this.data.depositType,
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
