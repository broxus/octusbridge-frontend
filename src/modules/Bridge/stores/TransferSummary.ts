import { makeAutoObservable } from 'mobx'

import {
    DEFAULT_TRANSFER_SUMMARY_STORE_DATA,
    DEFAULT_TRANSFER_SUMMARY_STORE_STATE,
} from '@/modules/Bridge/constants'
import { TransferSummaryData, TransferSummaryState } from '@/modules/Bridge/types'
import { TokenAssetVault, TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'


export class TransferSummary {

    protected data: TransferSummaryData

    protected state: TransferSummaryState

    constructor(protected readonly tokensCache: TokensCacheService) {
        this.data = DEFAULT_TRANSFER_SUMMARY_STORE_DATA
        this.state = DEFAULT_TRANSFER_SUMMARY_STORE_STATE

        makeAutoObservable(this)
    }

    public changeState<K extends keyof TransferSummaryState>(
        key: K,
        value: TransferSummaryState[K],
    ): void {
        this.state[key] = value
    }

    public updateData(data: TransferSummaryData): void {
        this.data = {
            ...this.data,
            ...data,
        }
    }

    public reset(): void {
        this.data = DEFAULT_TRANSFER_SUMMARY_STORE_DATA
        this.state = DEFAULT_TRANSFER_SUMMARY_STORE_STATE
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

    public get tokenVault(): TokenAssetVault | undefined {
        if (this.token?.root === undefined || this.leftNetwork?.chainId === undefined) {
            return undefined
        }
        return this.token.vaults?.find(vault => vault.chainId === this.leftNetwork!.chainId)
    }

    public get tokenVaultRight(): TokenAssetVault | undefined {
        if (this.token?.root === undefined || this.rightNetwork?.chainId === undefined) {
            return undefined
        }
        return this.token.vaults?.find(vault => vault.chainId === this.rightNetwork!.chainId)
    }

    public get vaultBalance(): string | undefined {
        if (this.isEvmToTon) {
            return this.tokenVault?.balance
        }

        if (this.isTonToEvm) {
            return this.tokenVaultRight?.balance
        }

        return undefined
    }

    public get vaultDecimals(): number | undefined {
        if (this.isEvmToTon) {
            return this.tokenVault?.decimals
        }

        if (this.isTonToEvm) {
            return this.tokenVaultRight?.decimals
        }

        return undefined
    }

    public get isEvmToEvm(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'evm'
    }

    public get isEvmToTon(): boolean {
        return this.leftNetwork?.type === 'evm' && this.rightNetwork?.type === 'ton'
    }

    public get isFromTon(): boolean {
        return this.leftNetwork?.type === 'ton'
    }

    public get isTonToEvm(): boolean {
        return this.leftNetwork?.type === 'ton' && this.rightNetwork?.type === 'evm'
    }

}

const TransferSummaryStore = new TransferSummary(useTokensCache())

export function useSummary(): TransferSummary {
    return TransferSummaryStore
}
