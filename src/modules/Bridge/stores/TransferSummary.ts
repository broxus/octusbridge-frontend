import { makeAutoObservable } from 'mobx'

import { DEFAULT_TRANSFER_SUMMARY_STORE_DATA } from '@/modules/Bridge/constants'
import { TransferSummaryData } from '@/modules/Bridge/types'


export class TransferSummary {

    protected data: TransferSummaryData = DEFAULT_TRANSFER_SUMMARY_STORE_DATA

    constructor() {
        makeAutoObservable(this)
    }

    public get amount(): TransferSummaryData['amount'] {
        return this.data.amount
    }

    public get decimals(): TransferSummaryData['decimals'] {
        return this.data.decimals
    }

    public get fee(): TransferSummaryData['fee'] {
        return this.data.fee
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
            || this.rightNetwork?.chainId === undefined
            || this.rightNetwork.type !== 'evm'
        ) {
            return undefined
        }
        return this.token.vaults?.find(vault => vault.chainId === this.rightNetwork!.chainId)?.vaultBalance
    }

    public get vaultDecimals(): number | undefined {
        if (this.token === undefined || this.rightNetwork?.chainId === undefined) {
            return undefined
        }
        return this.token.vaults.find(vault => vault.chainId === this.rightNetwork!.chainId)?.decimals
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

const TransferSummaryStore = new TransferSummary()

export function useSummary(): TransferSummary {
    return TransferSummaryStore
}
