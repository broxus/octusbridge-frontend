import { IndexerApiBaseUrl } from '@/config'
import {
    Transfer, TransferKind, TransfersGraphVolumeRequest, TransfersGraphVolumeResponse,
    TransfersMainInfoResponse, TransfersRequest, TransfersResponse, TransferStatus,
} from '@/modules/Transfers/types'
import { BadgeStatus } from '@/components/common/Badge'
import { findNetwork, handleApi } from '@/utils'
import { NetworkShape } from '@/types'

export async function handleTransfers(params: TransfersRequest): Promise<TransfersResponse> {
    return handleApi<TransfersResponse>({
        url: `${IndexerApiBaseUrl}/transfers/search`,
        data: params,
    })
}

export async function handleTransfersVolume(
    params: TransfersGraphVolumeRequest,
): Promise<TransfersGraphVolumeResponse> {
    return handleApi<TransfersGraphVolumeResponse>({
        url: `${IndexerApiBaseUrl}/transfers/graph/volume`,
        data: params,
    })
}

export async function handleMainInfo(): Promise<TransfersMainInfoResponse> {
    return handleApi<TransfersMainInfoResponse>({
        method: 'GET',
        url: `${IndexerApiBaseUrl}/transfers/main_page`,
    })
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

export function getFromNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'EthToEth':
            return transfer.ethTonChainId
                ? findNetwork(`${transfer.ethTonChainId}`, 'evm')
                : undefined
        case 'TonToEth':
            return findNetwork('1', 'everscale')
        default:
            return undefined
    }
}

export function getToNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind) {
        case 'EthToTon':
        case 'CreditEthToTon':
            return findNetwork('1', 'everscale')
        case 'EthToEth':
        case 'TonToEth':
            return transfer.tonEthChainId
                ? findNetwork(`${transfer.tonEthChainId}`, 'evm')
                : undefined
        default:
            return undefined
    }
}

export function getTransferLink(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'TonToEth':
            return transfer.tonEthChainId && transfer.tonEthContractAddress
                ? `/transfer/everscale-1/evm-${transfer.tonEthChainId}/${transfer.tonEthContractAddress}`
                : undefined
        case 'EthToTon':
            return transfer.ethTonChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/everscale-1/${transfer.ethTonTransactionHashEth}/default`
                : undefined
        case 'CreditEthToTon':
            return transfer.ethTonChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/everscale-1/${transfer.ethTonTransactionHashEth}/credit`
                : undefined
        case 'EthToEth':
            return transfer.ethTonChainId && transfer.tonEthChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/evm-${transfer.tonEthChainId}/${transfer.ethTonTransactionHashEth}/credit`
                : undefined
        default:
            return undefined
    }
}

export function getTypeIntlId(transferKind: TransferKind): string | undefined {
    switch (transferKind) {
        case 'TonToEth':
            return 'TRANSFERS_TYPE_DEFAULT'
        case 'EthToTon':
            return 'TRANSFERS_TYPE_DEFAULT'
        case 'CreditEthToTon':
            return 'TRANSFERS_TYPE_CREDIT'
        case 'EthToEth':
            return 'TRANSFERS_TYPE_TRANSIT'
        default:
            return undefined
    }
}

export function getFromAddress(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'TonToEth':
            return transfer.tonUserAddress
        case 'EthToTon':
            return transfer.ethTonEthUserAddress
        case 'CreditEthToTon':
            return transfer.ethTonEthUserAddress
        case 'EthToEth':
            return transfer.ethTonEthUserAddress
        default:
            return undefined
    }
}

export function getToAddress(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'TonToEth':
            return transfer.tonEthEthUserAddress
        case 'EthToTon':
            return transfer.tonUserAddress
        case 'CreditEthToTon':
            return transfer.tonUserAddress
        case 'EthToEth':
            return transfer.tonEthEthUserAddress
        default:
            return undefined
    }
}
