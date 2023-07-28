import { type BadgeStatus } from '@/components/common/Badge'
import { IndexerApiBaseUrl } from '@/config'
import {
    type Transfer,
    type TransferKind,
    type TransferStatus,
    type TransfersGraphVolumeRequest,
    type TransfersGraphVolumeResponse,
    type TransfersMainInfoResponse,
    type TransfersRequest,
    type TransfersResponse,
} from '@/modules/Transfers/types'
import { type NetworkShape } from '@/types'
import { findNetwork, handleApi } from '@/utils'

export async function handleTransfers(params: TransfersRequest): Promise<TransfersResponse> {
    return handleApi<TransfersResponse>({
        data: params,
        url: `${IndexerApiBaseUrl}/transfers/search`,
    })
}

export async function handleTransfersVolume(
    params: TransfersGraphVolumeRequest,
): Promise<TransfersGraphVolumeResponse> {
    return handleApi<TransfersGraphVolumeResponse>({
        data: params,
        url: `${IndexerApiBaseUrl}/transfers/graph/volume`,
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
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthTonTokenAddress
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.ethTonTonTokenAddress
        default:
            return undefined
    }
}

export function getAmount(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthVolumeExec
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.ethTonVolumeExec
        default:
            return undefined
    }
}

export function getFromNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind) {
        case 'AlienEthToTon':
        case 'NativeEthToTon':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.ethTonChainId ? findNetwork(`${transfer.ethTonChainId}`, 'evm') : undefined
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return findNetwork('42', 'tvm')
        default:
            return undefined
    }
}

export function getToNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind) {
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return findNetwork('42', 'tvm')
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthChainId ? findNetwork(`${transfer.tonEthChainId}`, 'evm') : undefined
        default:
            return undefined
    }
}

export function getTransitNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind) {
        case 'AlienEthToEth':
        case 'NativeEthToEth':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return findNetwork('42', 'tvm')
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonEthChainId ? findNetwork(`${transfer.tonEthChainId}`, 'evm') : undefined
        default:
            return undefined
    }
}

export function getTransferLink(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonEthChainId && transfer.tonEthContractAddress
                ? `/transfer/tvm-42/evm-${transfer.tonEthChainId}/${transfer.tonEthContractAddress}`
                : undefined
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.ethTonChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/tvm-42/${transfer.ethTonTransactionHashEth}`
                : undefined
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.ethTonChainId && transfer.tonEthChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/evm-${transfer.tonEthChainId}/${transfer.ethTonTransactionHashEth}`
                : undefined
        default:
            return undefined
    }
}

export function getTypeIntlId(transferKind: TransferKind): string | undefined {
    switch (transferKind) {
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return 'TRANSFERS_TYPE_DEFAULT'
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return 'TRANSFERS_TYPE_TRANSIT'
        default:
            return undefined
    }
}

export function getFromAddress(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonUserAddress
        case 'AlienEthToTon':
        case 'NativeEthToTon':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.ethTonEthUserAddress
        default:
            return undefined
    }
}

export function getToAddress(transfer: Transfer): string | undefined {
    switch (transfer.transferKind) {
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonEthEthUserAddress
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.tonUserAddress
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthEthUserAddress
        default:
            return undefined
    }
}
