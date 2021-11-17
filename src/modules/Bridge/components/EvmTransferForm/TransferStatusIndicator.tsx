import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { BlockScanTxLink } from '@/components/common/BlockScanTxLink'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { BeforeUnloadAlert } from '@/modules/Bridge/components/BeforeUnloadAlert'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge, useEvmTransfer } from '@/modules/Bridge/providers'
import { TransferStateStatus } from '@/modules/Bridge/types'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { isEvmTxHashValid, sliceAddress } from '@/utils'


export function TransferStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEvmTransfer()

    const [transferStatus, setTransferStatus] = React.useState<TransferStateStatus>('disabled')

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)

    const onTransfer = async () => {
        if (isTransferPage || transferStatus === 'pending') {
            return
        }

        try {
            setTransferStatus('pending')
            await bridge.transfer(() => {
                setTransferStatus('disabled')
            })
        }
        catch (e) {
            setTransferStatus('disabled')
        }
    }

    return (
        <div className="crosschain-transfer__status">
            <Observer>
                {() => {
                    const evmWallet = isTransferPage ? transfer.useEvmWallet : bridge.useEvmWallet
                    const tonWallet = isTransferPage ? transfer.useTonWallet : bridge.useTonWallet
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
                    const status = isTransferPage ? (transfer.transferState?.status || 'disabled') : transferStatus
                    const isConfirmed = status === 'confirmed'
                    const isRejected = status === 'rejected'
                    const isPending = status === 'pending'
                    const { confirmedBlocksCount = 0, eventBlocksToConfirm = 0 } = { ...transfer.transferState }
                    const waitingWallet = (
                        (!isEvmWalletReady || !isTonWalletReady)
                        && !isConfirmed
                    )
                    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
                    const wrongNetwork = (
                        isEvmWalletReady
                        && leftNetwork !== undefined
                        && !isSameNetwork(leftNetwork?.chainId, evmWallet.chainId)
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
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_CONFIRMED',
                                                            })

                                                        case 'pending':
                                                            return intl.formatMessage({
                                                                id: confirmedBlocksCount > 0
                                                                    ? 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_CONFIRMATION'
                                                                    : 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_PENDING',
                                                            }, {
                                                                confirmedBlocksCount,
                                                                eventBlocksToConfirm,
                                                            })

                                                        case 'rejected':
                                                            return intl.formatMessage({
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_REJECTED',
                                                            })

                                                        default:
                                                            return intl.formatMessage({
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_DISABLED',
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
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_NOTE',
                                        }, {
                                            networkName: leftNetwork?.name || '',
                                        })}
                                    </div>
                                    {(transfer.txHash !== undefined && leftNetwork !== undefined) && (
                                        <BlockScanTxLink
                                            key="tx-link"
                                            baseUrl={leftNetwork.explorerBaseUrl}
                                            className="text-muted"
                                            copy
                                            hash={transfer.txHash}
                                        >
                                            {sliceAddress(transfer.txHash)}
                                        </BlockScanTxLink>
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
                                                    network={leftNetwork}
                                                    wallet={evmWallet}
                                                />
                                            )
                                        }

                                        return (
                                            <Button
                                                disabled={(
                                                    isTransferPage
                                                    || isPending
                                                    || isConfirmed
                                                    || isRejected
                                                )}
                                                type="primary"
                                                onClick={!isTransferPage ? onTransfer : undefined}
                                            >
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_BTN_TEXT',
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
            {transferStatus === 'pending' && (
                <BeforeUnloadAlert key="unload-alert" />
            )}
        </div>
    )
}
