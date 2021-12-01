import * as React from 'react'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { CreditProcessorState, ReleaseStateStatus } from '@/modules/Bridge/types'


type Props = {
    children?: React.ReactNode;
    creditProcessorState?: CreditProcessorState;
    isCancelled?: boolean;
    isCanceling?: boolean;
    isProcessing?: boolean;
    isWithdrawing?: boolean;
    note?: React.ReactNode;
    status: ReleaseStateStatus;
    waitingWallet?: boolean;
    wrongNetwork?: boolean;
}

const messages = [
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_PENDING',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_EVENT_NOT_DEPLOYED',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_EVENT_DEPLOY_IN_PROGRESS',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_EVENT_CONFIRMED',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_EVENT_REJECTED',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_CHECKING_AMOUNT',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_CALCULATE_SWAP',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_SWAP_IN_PROGRESS',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_SWAP_FAILED',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_SWAP_UNKNOWN',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_UNWRAP_IN_PROGRESS',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_UNWRAP_FAILED',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_PROCESS_REQUIRES_GAS',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_PROCESSED',
    'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCELLED',
]


export function SwapStatus({
    children,
    creditProcessorState,
    isCancelled,
    isCanceling,
    isProcessing,
    isWithdrawing,
    note,
    status,
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
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CONFIRMED',
                                        })

                                    case 'pending': {
                                        let descriptor = !creditProcessorState
                                            ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_EXCHANGING'
                                            : messages[creditProcessorState]

                                        if (isCanceling) {
                                            descriptor = 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCELING'
                                        }
                                        else if (isProcessing) {
                                            descriptor = 'CROSSCHAIN_TRANSFER_STATUS_SWAP_PROCESSING'
                                        }
                                        else if (isWithdrawing) {
                                            descriptor = 'CROSSCHAIN_TRANSFER_STATUS_SWAP_WITHDRAWING'
                                        }
                                        else if (isCancelled) {
                                            descriptor = 'CROSSCHAIN_TRANSFER_STATUS_SWAP_PENDING'
                                        }

                                        return intl.formatMessage({
                                            id: descriptor,
                                        })
                                    }

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: !creditProcessorState
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_REJECTED'
                                                : messages[creditProcessorState],
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: isCancelled
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCELLED'
                                                : 'CROSSCHAIN_TRANSFER_STATUS_SWAP_DISABLED',
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
                        id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_NOTE',
                    })}
                </div>

                {children}
            </div>
        </div>
    )
}
