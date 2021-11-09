import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useTonTransfer } from '@/modules/Bridge/providers/TonTransferStoreProvider'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { isTonAddressValid } from '@/utils'


export function ReleaseStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useTonTransfer()

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isTonAddressValid(transfer.contractAddress.toString())
    )

    const onRelease = async () => {
        if (
            !isTransferPage
            || (
                transfer.releaseState !== undefined
                && ['confirmed', 'pending'].includes(transfer.releaseState.status)
            )
        ) {
            return
        }

        await transfer.release()
    }

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
                    const isEventConfirmed = transfer.eventState?.status === 'confirmed'
                    const status = transfer.releaseState?.status || 'disabled'
                    const isDisabled = status === undefined || status === 'disabled'
                    const isConfirmed = status === 'confirmed'
                    const isPending = status === 'pending'
                    const waitingWallet = (
                        (!isEvmWalletReady || !isTonWalletReady)
                        && isPrepareConfirmed
                        && isEventConfirmed
                        && !isConfirmed
                    )
                    const wrongNetwork = (
                        isEvmWalletReady
                        && transfer.rightNetwork !== undefined
                        && !isSameNetwork(transfer.rightNetwork.chainId, evmWallet.chainId)
                        && isPrepareConfirmed
                        && isEventConfirmed
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
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_CONFIRMED',
                                                            })

                                                        case 'pending':
                                                            return intl.formatMessage({
                                                                id: transfer.releaseState?.isReleased === undefined && status === 'pending'
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
                                    }}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <div className="crosschain-transfer__status-note">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_EVM_NOTE',
                                    }, {
                                        networkName: transfer.rightNetwork?.label || 'Ethereum',
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
                                                    network={transfer.rightNetwork}
                                                    wallet={evmWallet}
                                                />
                                            )
                                        }

                                        return (
                                            <Button
                                                disabled={(!isTransferPage || (
                                                    !isPrepareConfirmed
                                                    || !isEventConfirmed
                                                    || !isDisabled
                                                    || isConfirmed
                                                    || isPending
                                                ))}
                                                type="primary"
                                                onClick={isTransferPage ? onRelease : undefined}
                                            >
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_BTN_TEXT',
                                                })}
                                            </Button>
                                        )
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
