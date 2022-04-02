import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { EventStateStatus } from '@/modules/Bridge/types'
import { sliceAddress } from '@/utils'


type Props = {
    children?: React.ReactNode;
    confirmations: number;
    isCancelled?: boolean;
    note?: React.ReactNode;
    requiredConfirmations: number;
    status: EventStateStatus;
    txHash?: string;
    waitingWallet?: boolean;
    wrongNetwork?: boolean;
}

export function EventStatus({
    children,
    confirmations,
    isCancelled,
    note,
    requiredConfirmations,
    status,
    txHash,
    waitingWallet,
    wrongNetwork,
}: Props): JSX.Element {
    const intl = useIntl()

    const isConfirmed = status === 'confirmed'

    return (
        <div
            className={classNames('crosschain-transfer__status', {
                cancelled: isCancelled,
            })}
        >
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
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: confirmations > 0
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_EVENT_CONFIRMATION'
                                                : 'CROSSCHAIN_TRANSFER_STATUS_EVENT_PENDING',
                                        }, {
                                            confirmations,
                                            requiredConfirmations,
                                        })

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_DISABLED',
                                        })
                                }
                            })()}
                        </StatusIndicator>
                    )
                })()}
            </div>
            <div className="crosschain-transfer__status-control">
                <div className="crosschain-transfer__status-note">
                    {note || intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_NOTE',
                    })}
                    {(isConfirmed && txHash !== undefined) && (
                        <EverscanAccountLink
                            key="tx-link"
                            address={txHash}
                            className="text-muted"
                            copy
                        >
                            {sliceAddress(txHash)}
                        </EverscanAccountLink>
                    )}
                </div>

                {children}
            </div>
        </div>
    )
}
