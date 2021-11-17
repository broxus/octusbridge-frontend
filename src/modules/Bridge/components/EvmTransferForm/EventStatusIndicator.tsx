import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { useEvmTransfer } from '@/modules/Bridge/providers'


export function EventStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()

    return (
        <div className="crosschain-transfer__status">
            <Observer>
                {() => {
                    const tonWallet = transfer.useTonWallet
                    const isTonWalletReady = (
                        !tonWallet.isInitializing
                        && !tonWallet.isConnecting
                        && tonWallet.isInitialized
                        && tonWallet.isConnected
                    )
                    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
                    const isPrepareConfirmed = transfer.prepareState?.status === 'confirmed'
                    const {
                        confirmations = 0,
                        requiredConfirmations = 0,
                        status = 'disabled',
                    } = { ...transfer.eventState }
                    const isConfirmed = status === 'confirmed'
                    const waitingWallet = (
                        !isTonWalletReady
                        && isTransferConfirmed
                        && isPrepareConfirmed
                        && !isConfirmed
                    )

                    return (
                        <>
                            <div className="crosschain-transfer__status-indicator">
                                <Observer>
                                    {() => {
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
                                    }}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <div className="crosschain-transfer__status-note">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_NOTE',
                                    })}
                                </div>

                                <Observer>
                                    {() => {
                                        if (tonWallet.isInitializing) {
                                            return null
                                        }

                                        if (waitingWallet) {
                                            return (
                                                <Button
                                                    key="ton"
                                                    disabled={tonWallet.isInitializing || tonWallet.isConnecting}
                                                    type="primary"
                                                    onClick={tonWallet.connect}
                                                >
                                                    {intl.formatMessage({
                                                        id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                                                    })}
                                                </Button>
                                            )
                                        }

                                        return null
                                    }}
                                </Observer>
                            </div>
                        </>
                    )
                }}
            </Observer>
        </div>
    )
}
