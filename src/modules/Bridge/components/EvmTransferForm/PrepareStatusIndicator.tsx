import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmTransfer } from '@/modules/Bridge/providers'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { isEvmTxHashValid, sliceAddress } from '@/utils'


export function PrepareStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)

    const onPrepare = async () => {
        if (
            !isTransferPage
            || (
                transfer.prepareState !== undefined
                && ['confirmed', 'pending'].includes(transfer.prepareState.status)
            )
        ) {
            return
        }

        await transfer.prepare()
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
                    const status = transfer.prepareState?.status || 'disabled'
                    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
                    const isDisabled = status === undefined || status === 'disabled'
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

                                                        case 'pending': {
                                                            let descriptor = 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_PREPARING'

                                                            if (transfer.prepareState?.isDeployed === undefined) {
                                                                descriptor = 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_CHECKING'
                                                            }

                                                            return intl.formatMessage({
                                                                id: transfer.prepareState?.isDeploying
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

                                        return (
                                            <Button
                                                disabled={(!isTransferPage || (
                                                    !isTransferConfirmed
                                                    || !isDisabled
                                                ))}
                                                type="primary"
                                                onClick={isTransferPage ? onPrepare : undefined}
                                            >
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
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
