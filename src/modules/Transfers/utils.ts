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
    switch (transfer.transferKind as string) {
        case 'TonToEth':
        case 'EthToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthTonTokenAddress
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.ethTonTonTokenAddress
        default:
            return undefined
    }
}

export function getAmount(transfer: Transfer): string | undefined {
    switch (transfer.transferKind as string) {
        case 'TonToEth':
        case 'EthToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthVolumeExec
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.ethTonVolumeExec
        default:
            return undefined
    }
}

export function getFromNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind as string) {
        case 'EthToTon':
        case 'EthToEth':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.ethTonChainId ? findNetwork(`${transfer.ethTonChainId}`, 'evm') : undefined
        case 'TonToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return findNetwork('42', 'tvm')
        default:
            return undefined
    }
}

export function getToNetwork(transfer: Transfer): NetworkShape | undefined {
    switch (transfer.transferKind as string) {
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return findNetwork('42', 'tvm')
        case 'TonToEth':
        case 'EthToEth':
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
    switch (transfer.transferKind as string) {
        case 'EthToTon':
        case 'EthToEth':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return findNetwork('42', 'tvm')
        case 'TonToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonEthChainId ? findNetwork(`${transfer.tonEthChainId}`, 'evm') : undefined
        default:
            return undefined
    }
}

export function getTransferLink(transfer: Transfer): string | undefined {
    switch (transfer.transferKind as string) {
        case 'TonToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonEthChainId && transfer.tonEthContractAddress
                ? `/transfer/tvm-42/evm-${transfer.tonEthChainId}/${transfer.tonEthContractAddress}`
                : undefined
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.ethTonChainId && transfer.ethTonTransactionHashEth
                ? `/transfer/evm-${transfer.ethTonChainId}/tvm-42/${transfer.ethTonTransactionHashEth}`
                : undefined
        case 'EthToEth':
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
    switch (transferKind as string) {
        case 'TonToEth':
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return 'TRANSFERS_TYPE_DEFAULT'
        case 'EthToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return 'TRANSFERS_TYPE_TRANSIT'
        default:
            return undefined
    }
}

export function getFromAddress(transfer: Transfer): string | undefined {
    switch (transfer.transferKind as string) {
        case 'TonToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonUserAddress
        case 'EthToTon':
        case 'EthToEth':
        case 'CreditEthToTon':
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
    switch (transfer.transferKind as string) {
        case 'TonToEth':
        case 'AlienTonToEth':
        case 'NativeTonToEth':
            return transfer.tonEthEthUserAddress
        case 'EthToTon':
        case 'CreditEthToTon':
        case 'AlienEthToTon':
        case 'NativeEthToTon':
            return transfer.tonUserAddress
        case 'EthToEth':
        case 'AlienEthToEth':
        case 'NativeEthToEth':
            return transfer.tonEthEthUserAddress
        default:
            return undefined
    }
}
