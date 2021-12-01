import * as React from 'react'
import { useIntl } from 'react-intl'

import { BlockScanTxLink } from '@/components/common/BlockScanTxLink'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { BeforeUnloadAlert } from '@/modules/Bridge/components/BeforeUnloadAlert'
import { TransferStateStatus } from '@/modules/Bridge/types'
import { NetworkShape } from '@/types'
import { sliceAddress } from '@/utils'


type Props = {
    children?: React.ReactNode;
    confirmedBlocksCount: number;
    eventBlocksToConfirm: number;
    isTransferPage: boolean;
    network?: NetworkShape;
    note?: React.ReactNode;
    status: TransferStateStatus;
    txHash?: string;
    waitingWallet?: boolean;
    wrongNetwork?: boolean;
}

export function TransferStatus({
    children,
    confirmedBlocksCount,
    eventBlocksToConfirm,
    isTransferPage,
    network,
    note,
    status,
    txHash,
    waitingWallet,
    wrongNetwork,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-indicator">
                {(() => {
                    if (waitingWallet) {
                        return (
                            <StatusIndicator status="pending">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_WALLET',
                                })}
                            </StatusIndicator>
                        )
                    }

                    if (wrongNetwork) {
                        return (
                            <StatusIndicator status="pending">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_NETWORK',
                                })}
                            </StatusIndicator>
                        )
                    }

                    return (
                        <StatusIndicator status={status}>
                            {(() => {
                                switch (status) {
                                    case 'confirmed':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: confirmedBlocksCount > 0
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_CONFIRMATION'
                                                : 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_PENDING',
                                        }, {
                                            confirmedBlocksCount,
                                            eventBlocksToConfirm,
                                        })

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_DISABLED',
                                        })
                                }
                            })()}
                        </StatusIndicator>
                    )
                })()}
            </div>
            <div className="crosschain-transfer__status-control">
                <div className="crosschain-transfer__status-note">
                    <div>
                        {note || intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_NOTE',
                        }, {
                            network: network?.label || '',
                        })}
                    </div>
                    {(txHash !== undefined && network !== undefined) && (
                        <BlockScanTxLink
                            key="tx-link"
                            baseUrl={network.explorerBaseUrl}
                            className="text-muted"
                            copy
                            hash={txHash}
                        >
                            {sliceAddress(txHash)}
                        </BlockScanTxLink>
                    )}
                </div>

                {children}
            </div>

            {(!isTransferPage && status === 'pending') && (
                <BeforeUnloadAlert key="unload-alert" />
            )}
        </div>
    )
}
