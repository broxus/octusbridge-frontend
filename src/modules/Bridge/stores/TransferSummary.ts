import { makeAutoObservable } from 'mobx'

import { DEFAULT_TRANSFER_SUMMARY_STORE_DATA } from '@/modules/Bridge/constants'
import { TransferSummaryData } from '@/modules/Bridge/types'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'


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

    public get vaultBalance(): string | undefined {
        if (
            this.token?.root === undefined
            || (this.isEvmToTon && this.leftNetwork?.chainId === undefined)
            || (this.isTonToEvm && this.rightNetwork?.chainId === undefined)
        ) {
            return undefined
        }

        if (this.isEvmToTon) {
            return this.token.vaults?.find(vault => vault.chainId === this.leftNetwork!.chainId)?.balance
        }

        if (this.isTonToEvm) {
            return this.token.vaults?.find(vault => vault.chainId === this.rightNetwork!.chainId)?.balance
        }

        return undefined
    }

    public get vaultDecimals(): number | undefined {
        if (
            this.token?.root === undefined
            || (this.isEvmToTon && this.leftNetwork?.chainId === undefined)
            || (this.isTonToEvm && this.rightNetwork?.chainId === undefined)
        ) {
            return undefined
        }

        if (this.isEvmToTon) {
            return this.token.vaults?.find(vault => vault.chainId === this.leftNetwork!.chainId)?.decimals
        }

        if (this.isTonToEvm) {
            return this.token.vaults?.find(vault => vault.chainId === this.rightNetwork!.chainId)?.decimals
        }

        return undefined
    }

    public get isEvmToTon(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'ton'
    }

    public get isTonToEvm(): boolean {
        return this.leftNetwork?.type === 'ton' && this.rightNetwork?.type === 'evm'
    }

    public get isEvmToEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
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
