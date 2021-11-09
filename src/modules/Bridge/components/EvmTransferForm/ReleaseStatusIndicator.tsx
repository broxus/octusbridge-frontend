import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { useEvmTransfer } from '@/modules/Bridge/providers'


export function ReleaseStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()
    const tonWallet = transfer.useTonWallet

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-indicator">
                <Observer>
                    {() => {
                        const isTonWalletReady = (
                            !tonWallet.isInitializing
                            && !tonWallet.isConnecting
                            && tonWallet.isInitialized
                            && tonWallet.isConnected
                        )
                        const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
                        const isPrepareConfirmed = transfer.prepareState?.status === 'confirmed'
                        const status = transfer.eventState?.status || 'disabled'
                        const isConfirmed = status === 'confirmed'
                        const waitingWallet = (
                            !isTonWalletReady
                            && isTransferConfirmed
                            && isPrepareConfirmed
                            && !isConfirmed
                        )

                        if (waitingWallet) {
                            return (
                                <StatusIndicator status="pending">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_WALLET',
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
                                                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_PENDING',
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
                    }}
                </Observer>
            </div>
            <div className="crosschain-transfer__status-control">
                <div className="crosschain-transfer__status-note">
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
                    })}
                </div>
            </div>
        </div>
    )
}
