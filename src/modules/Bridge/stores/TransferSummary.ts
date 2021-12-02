import { makeAutoObservable } from 'mobx'

import { DEFAULT_TRANSFER_SUMMARY_STORE_DATA } from '@/modules/Bridge/constants'
import { TransferSummaryData } from '@/modules/Bridge/types'
import { TokenAssetVault, TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'


export class TransferSummary {

    protected data: TransferSummaryData

    constructor(protected readonly tokensCache: TokensCacheService) {
        this.data = DEFAULT_TRANSFER_SUMMARY_STORE_DATA

        makeAutoObservable(this)
    }

    public get amount(): TransferSummaryData['amount'] {
        return this.data.amount
    }

    public get bridgeFee(): TransferSummaryData['bridgeFee'] {
        return this.data.bridgeFee
    }

    public get decimals(): TransferSummaryData['decimals'] {
        return this.isFromEvm ? this.token?.decimals : this.tokenVault?.decimals
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

    public get token(): TransferSummaryData['token'] {
        return this.data.token
    }

    public get tokenVault(): TokenAssetVault | undefined {
        if (this.token?.root === undefined || this.rightNetwork?.chainId === undefined) {
            return undefined
        }
        return this.tokensCache.getTokenVault(this.token.root, this.rightNetwork.chainId)
    }

    public get isEvmToTon(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'ton'
    }

    public get isTonToEvm(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        return this.leftNetwork?.type === 'ton' && this.rightNetwork?.type === 'evm'
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

    public update(data: TransferSummaryData): void {
        this.data = {
            ...this.data,
            ...data,
        }
    }

    public clean(): void {
        this.data = DEFAULT_TRANSFER_SUMMARY_STORE_DATA
    }

}

const TransferSummaryStore = new TransferSummary(useTokensCache())

export function useSummary(): TransferSummary {
    return TransferSummaryStore
}
