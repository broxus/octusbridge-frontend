import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { ReleaseStateStatus } from '@/modules/Bridge/types'
import { NetworkShape } from '@/types'


type Props = {
    children?: React.ReactNode;
    isCancelled?: boolean;
    isReleased?: boolean;
    network?: NetworkShape;
    note?: React.ReactNode;
    status: ReleaseStateStatus;
    waitingWallet?: boolean;
    wrongNetwork?: boolean;
}

export function ReleaseStatus({
    children,
    isCancelled,
    isReleased,
    network,
    note,
    status,
    waitingWallet,
    wrongNetwork,
}: Props): JSX.Element {
    const intl = useIntl()

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
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: isReleased === undefined
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_CHECKING'
                                                : 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_PENDING',
                                        })

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_DISABLED',
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
                        id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
                    }, {
                        network: network?.label || '',
                    })}
                </div>

                {children}
            </div>
        </div>
    )
}
