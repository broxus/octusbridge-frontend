import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { BeforeUnloadAlert } from '@/modules/Bridge/components/BeforeUnloadAlert'
import { PrepareStateStatus } from '@/modules/Bridge/types'
import { sliceAddress } from '@/utils'


type Props = {
    children?: React.ReactNode;
    isBroadcasting?: boolean;
    isCancelled?: boolean;
    isDeployed?: boolean
    isDeploying?: boolean;
    isTokenDeploying?: boolean;
    isTransferPage: boolean;
    note?: React.ReactNode;
    status: PrepareStateStatus;
    txHash?: string;
    waitingWallet?: boolean;
    wrongNetwork?: boolean;
}

export function PrepareStatus({
    children,
    isBroadcasting,
    isCancelled,
    isDeployed,
    isDeploying,
    isTokenDeploying,
    isTransferPage,
    note,
    status,
    txHash,
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
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_CONFIRMED',
                                        })

                                    case 'pending': {
                                        if (isBroadcasting) {
                                            return intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BROADCASTING',
                                            })
                                        }

                                        if (isTokenDeploying) {
                                            return intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_DEPLOYING',
                                            })
                                        }

                                        let descriptor = 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_PREPARING'

                                        if (isDeployed === undefined) {
                                            descriptor = 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_CHECKING'
                                        }

                                        return intl.formatMessage({
                                            id: isDeploying
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_PENDING'
                                                : descriptor,
                                        })
                                    }

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_DISABLED',
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
                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                        }, {
                            network: 'unknown',
                        })}
                    </div>
                    {txHash !== undefined && (
                        <EverscanAccountLink
                            key="contract-link"
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

            {(!isTransferPage && status === 'pending') && (
                <BeforeUnloadAlert key="unload-alert" />
            )}
        </div>
    )
}
