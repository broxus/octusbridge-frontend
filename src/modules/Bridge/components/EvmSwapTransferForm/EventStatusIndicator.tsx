import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { sliceAddress } from '@/utils'


export function EventStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmSwapTransfer()

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
                    const wrongNetwork = (
                        isEvmWalletReady
                        && transfer.leftNetwork !== undefined
                        && !isSameNetwork(transfer.leftNetwork.chainId, evmWallet.chainId)
                        && isTransferConfirmed
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
                                    <div>
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_NOTE',
                                        })}
                                    </div>
                                    {(isConfirmed && transfer.deriveEventAddress !== undefined) && (
                                        <TonscanAccountLink
                                            key="tx-link"
                                            address={transfer.deriveEventAddress.toString()}
                                            className="text-muted"
                                            copy
                                        >
                                            {sliceAddress(transfer.deriveEventAddress.toString())}
                                        </TonscanAccountLink>
                                    )}
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
                                                    network={transfer.leftNetwork}
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
