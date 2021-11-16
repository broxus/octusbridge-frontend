import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { sliceAddress } from '@/utils'


export function PrepareStatusIndicator(): JSX.Element {
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
                    const status = transfer.prepareState?.status || 'disabled'
                    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
                    const isConfirmed = status === 'confirmed'
                    const waitingWallet = (
                        (!isEvmWalletReady || !isTonWalletReady)
                        && isTransferConfirmed
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
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_CONFIRMED',
                                                            })

                                                        case 'pending':
                                                            return intl.formatMessage({
                                                                id: transfer.prepareState?.isBroadcasting
                                                                    ? 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BROADCASTING'
                                                                    : 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_PREPARING',
                                                            })

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
                                    }}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <div className="crosschain-transfer__status-note">
                                    <div>
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                                        })}
                                    </div>
                                    {(isConfirmed && transfer.creditProcessorAddress !== undefined) && (
                                        <TonscanAccountLink
                                            key="tx-link"
                                            address={transfer.creditProcessorAddress.toString()}
                                            className="text-muted"
                                            copy
                                        >
                                            {sliceAddress(transfer.creditProcessorAddress.toString())}
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

                                        if ((
                                            transfer.prepareState?.isOutdated === true
                                            && transfer.transferState?.confirmedBlocksCount !== undefined
                                            && transfer.transferState.eventBlocksToConfirm !== undefined
                                            && transfer.transferState.confirmedBlocksCount > (
                                                transfer.transferState.eventBlocksToConfirm * 3
                                            )
                                        )) {
                                            return (
                                                <Button
                                                    disabled={transfer.prepareState.isBroadcasting}
                                                    type="primary"
                                                    onClick={transfer.broadcast}
                                                >
                                                    {intl.formatMessage({
                                                        id: 'CROSSCHAIN_TRANSFER_STATUS_BROADCAST_BTN_TEXT',
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
