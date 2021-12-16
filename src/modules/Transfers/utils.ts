import { IndexerApiBaseUrl } from '@/config'
import {
    Transfer, TransfersRequest, TransfersResponse, TransferStatus,
} from '@/modules/Transfers/types'
import { BadgeStatus } from '@/components/common/Badge'
import { findNetwork } from '@/utils'

export async function handleTransfersApi(params: TransfersRequest): Promise<TransfersResponse> {
    const url = `${IndexerApiBaseUrl}/transfers/search`
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })

    if (!response.ok) {
        throw response
    }

    const result: TransfersResponse = await response.json()

    return result
}

export function mapStatusToIntl(status?: TransferStatus): string {
    switch (status) {
        case 'Pending':
            return 'TRANSFERS_STATUS_PENDING'
        case 'Rejected':
            return 'TRANSFERS_STATUS_REJECTED'
        case 'Confirmed':
            return 'TRANSFERS_STATUS_CONFIRMED'
        default:
            return 'TRANSFERS_STATUS_UNKNOWN'
    }
}

export function mapStatusToBadge(status?: TransferStatus): BadgeStatus {
    switch (status) {
        case 'Pending':
            return 'warning'
        case 'Rejected':
            return 'disabled'
        case 'Confirmed':
            return 'success'
        default:
            return 'disabled'
    }
}

export function getCurrencyAddress(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
        case 'CreditEthToTon': {
            return transfer.ethTonTonTokenAddress
        }
        case 'TonToEth':
        case 'EthToEth': {
            return transfer.tonEthTonTokenAddress
        }
        default:
            return undefined
    }
}

export function getAmount(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
        case 'CreditEthToTon':
            return transfer.ethTonVolumeExec
        case 'TonToEth':
        case 'EthToEth':
            return transfer.tonEthVolumeExec
        default:
            return undefined
    }
}

export function getFromNetwork(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'EthToEth':
            return transfer.ethTonChainId
                ? findNetwork(`${transfer.ethTonChainId}`, 'evm')?.label
                : undefined
        case 'TonToEth':
            return findNetwork('1', 'ton')?.label
        default:
            return undefined
    }
}

export function getToNetwork(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
        case 'CreditEthToTon':
            return findNetwork('1', 'ton')?.label
        case 'EthToEth':
        case 'TonToEth':
            return transfer.tonEthChainId
                ? findNetwork(`${transfer.tonEthChainId}`, 'evm')?.label
                : undefined
        default:
            return undefined
    }
}

export function getTransferLink(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
            return transfer.ethTonChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/ton-1/${transfer.ethTonTransactionHashEth}`
                : undefined
        case 'TonToEth':
            return transfer.tonEthChainId && transfer.tonEthContractAddress
                ? `/transfer/ton-1/evm-${transfer.tonEthChainId}/${transfer.tonEthContractAddress}`
                : undefined
        case 'CreditEthToTon':
            return transfer.ethTonChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/ton-1/${transfer.ethTonTransactionHashEth}/credit`
                : undefined
        case 'EthToEth':
            return transfer.ethTonChainId && transfer.tonEthChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/evm-${transfer.tonEthChainId}/${transfer.ethTonTransactionHashEth}`
                : undefined
        default:
            return undefined
    }
}
