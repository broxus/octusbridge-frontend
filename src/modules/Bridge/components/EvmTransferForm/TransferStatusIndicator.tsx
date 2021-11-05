import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { BlockScanTxLink } from '@/components/common/BlockScanTxLink'
import { StatusIndicator } from '@/components/common/StatusIndicator'
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

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)

    const evmWallet = isTransferPage ? transfer.useEvmWallet : bridge.useEvmWallet
    const tonWallet = isTransferPage ? transfer.useTonWallet : bridge.useTonWallet

    const [transferState, setTransferState] = React.useState<TransferStateStatus>((
        isTransferPage ? (transfer.transferState?.status || 'pending') : 'disabled'
    ))

    const onTransfer = async () => {
        if (isTransferPage || (
            transfer.transferState?.status !== undefined
            && ['confirmed', 'pending', 'rejected'].includes(transfer.transferState.status)
        ) || transferState === 'pending') {
            return
        }

        try {
            setTransferState('pending')
            await bridge.transfer(() => {
                setTransferState('disabled')
            })
        }
        catch (e) {
            setTransferState('disabled')
        }
    }

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-label">
                <Observer>
                    {() => {
                        const isEvmWalletReady = evmWallet.isInitialized && evmWallet.isConnected
                        const isTonWalletReady = tonWallet.isInitialized && tonWallet.isConnected
                        const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
                        const state = isTransferPage ? (transfer.transferState?.status || 'disabled') : transferState

                        if (
                            (!isEvmWalletReady || !isTonWalletReady)
                            && (isTransferPage ? transfer.transferState?.status === 'pending' : transferState === 'pending')
                        ) {
                            return (
                                <StatusIndicator status="pending">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_WALLET',
                                    })}
                                </StatusIndicator>
                            )
                        }

                        const wrongNetwork = !isSameNetwork(leftNetwork?.chainId, evmWallet.chainId)

                        if (wrongNetwork && state === 'pending') {
                            return (
                                <StatusIndicator status="pending">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_NETWORK',
                                    })}
                                </StatusIndicator>
                            )
                        }

                        return (
                            <StatusIndicator status={state}>
                                {(() => {
                                    const {
                                        confirmedBlocksCount = 0,
                                        eventBlocksToConfirm = 0,
                                        status = state,
                                    } = { ...transfer.transferState }

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
                                                confirmed: confirmedBlocksCount,
                                                confirmations: eventBlocksToConfirm,
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
                    <Observer>
                        {() => (
                            <>
                                <span>
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_NOTE',
                                    }, {
                                        networkName: (
                                            isTransferPage ? transfer.leftNetwork?.name : bridge.leftNetwork?.name
                                        ) || '',
                                    })}
                                </span>
                                {(transfer.txHash !== undefined && transfer.leftNetwork) && (
                                    <BlockScanTxLink
                                        key="tx-link"
                                        baseUrl={transfer.leftNetwork.explorerBaseUrl}
                                        className="text-muted"
                                        copy
                                        hash={transfer.txHash}
                                    >
                                        {sliceAddress(transfer.txHash)}
                                    </BlockScanTxLink>
                                )}
                            </>
                        )}
                    </Observer>
                </div>

                <Observer>
                    {() => {
                        if (evmWallet.isInitializing || tonWallet.isInitializing) {
                            return null
                        }

                        const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
                        const state = isTransferPage ? (transfer.transferState?.status || 'disabled') : transferState
                        const wrongNetwork = (
                            evmWallet.isConnected
                            && tonWallet.isConnected
                            && !isSameNetwork(leftNetwork?.chainId, evmWallet.chainId)
                            && leftNetwork !== undefined
                            && (transfer.transferState === undefined || ['pending', 'disabled'].includes(state))
                        )

                        if (wrongNetwork) {
                            return <WrongNetworkError network={leftNetwork} />
                        }

                        const disabled = (
                            isTransferPage
                            || evmWallet.isConnecting
                            || tonWallet.isConnecting
                            || ['confirmed', 'pending', 'rejected'].includes(state)
                        )

                        return ((evmWallet.isConnected && tonWallet.isConnected) || ['confirmed', 'rejected'].includes(state))
                            ? (
                                <Button
                                    disabled={disabled}
                                    type="primary"
                                    onClick={onTransfer}
                                >
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_BTN_TEXT',
                                    })}
                                </Button>
                            ) : <WalletsConnectors />
                    }}
                </Observer>
            </div>
        </div>
    )
}
