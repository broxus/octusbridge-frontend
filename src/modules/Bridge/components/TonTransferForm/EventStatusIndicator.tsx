import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useTonTransfer } from '@/modules/Bridge/providers/TonTransferStoreProvider'
import { isSameNetwork } from '@/modules/Bridge/utils'


export function EventStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useTonTransfer()

    return (
        <div className="crosschain-transfer__status">
            <Observer>
                {() => {
                    const evmWallet = transfer.useEvmWallet
                    const tonWallet = transfer.useTonWallet
                    const isEvmWalletReady = (
                        !evmWallet.isInitializing
                        && !evmWallet.isConnecting
                        && evmWallet.isInitialized
                        && evmWallet.isConnected
                    )
                    const isTonWalletReady = (
                        !tonWallet.isInitializing
                        && !tonWallet.isConnecting
                        && tonWallet.isInitialized
                        && tonWallet.isConnected
                    )
                    const isPrepareConfirmed = transfer.prepareState?.status === 'confirmed'
                    const status = transfer.eventState?.status || 'disabled'
                    const isConfirmed = status === 'confirmed'
                    const { confirmations = 0, requiredConfirmations = 0 } = { ...transfer.eventState }
                    const waitingWallet = (
                        (!isEvmWalletReady || !isTonWalletReady)
                        && isPrepareConfirmed
                        && !isConfirmed
                    )
                    const wrongNetwork = (
                        isEvmWalletReady
                        && transfer.rightNetwork !== undefined
                        && !isSameNetwork(transfer.rightNetwork.chainId, evmWallet.chainId)
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
                                        if (evmWallet.isInitializing || tonWallet.isInitializing) {
                                            return null
                                        }

                                        if (waitingWallet) {
                                            return (
                                                <WalletsConnectors
                                                    evmWallet={evmWallet}
                                                    tonWallet={tonWallet}
                                                />
                                            )
                                        }

                                        if (wrongNetwork) {
                                            return (
                                                <WrongNetworkError
                                                    wallet={evmWallet}
                                                    network={transfer.rightNetwork}
                                                />
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
