import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { isGoodBignumber } from '@/utils'


const cpMessages = [
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


export function SwapStatusIndicator(): JSX.Element {
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
                    const isEventConfirmed = transfer.eventState?.status === 'confirmed'
                    const status = transfer.swapState?.status || 'disabled'
                    const isConfirmed = status === 'confirmed'
                    const isCancelled = transfer.creditProcessorState === CreditProcessorState.Cancelled
                    const isProcessorEventConfirmed = (
                        transfer.creditProcessorState === CreditProcessorState.EventConfirmed
                    )
                    const waitingWallet = (
                        (!isEvmWalletReady || !isTonWalletReady)
                        && isTransferConfirmed
                        && isPrepareConfirmed
                        && isEventConfirmed
                        && !isConfirmed
                        && !isCancelled
                    )
                    const wrongNetwork = (
                        isEvmWalletReady
                        && transfer.leftNetwork !== undefined
                        && !isSameNetwork(transfer.leftNetwork.chainId, evmWallet.chainId)
                        && isTransferConfirmed
                        && isPrepareConfirmed
                        && isEventConfirmed
                        && !isConfirmed
                        && !isCancelled
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
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CONFIRMED',
                                                            })

                                                        case 'pending': {
                                                            let descriptor = !transfer.creditProcessorState
                                                                ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_EXCHANGING'
                                                                : cpMessages[transfer.creditProcessorState]

                                                            if (transfer.swapState?.isCanceling) {
                                                                descriptor = 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCELING'
                                                            }
                                                            else if (transfer.swapState?.isProcessing) {
                                                                descriptor = 'CROSSCHAIN_TRANSFER_STATUS_SWAP_PROCESSING'
                                                            }
                                                            else if (transfer.swapState?.isWithdrawing) {
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
                                                                id: !transfer.creditProcessorState
                                                                    ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_REJECTED'
                                                                    : cpMessages[transfer.creditProcessorState],
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
                                    }}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <div className="crosschain-transfer__status-note">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_NOTE',
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
                                                    network={transfer.leftNetwork}
                                                />
                                            )
                                        }

                                        switch (true) {
                                            case (
                                                (transfer.swapState?.isStuck && transfer.isOwner)
                                                || transfer.isDeployer
                                            ):
                                                return (
                                                    <div className="btn-group">
                                                        {(transfer.isDeployer && isProcessorEventConfirmed) && (
                                                            <Button
                                                                key="process"
                                                                disabled={(
                                                                    transfer.swapState?.isProcessing
                                                                    || transfer.swapState?.isCanceling
                                                                )}
                                                                type="tertiary"
                                                                onClick={transfer.process}
                                                            >
                                                                {intl.formatMessage({
                                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_PROCESS_BTN_TEXT',
                                                                })}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            key="cancel"
                                                            disabled={(
                                                                transfer.swapState?.isCanceling
                                                                || transfer.swapState?.isProcessing
                                                            )}
                                                            type="tertiary"
                                                            onClick={transfer.cancel}
                                                        >
                                                            {intl.formatMessage({
                                                                id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCEL_BTN_TEXT',
                                                            })}
                                                        </Button>
                                                    </div>
                                                )

                                            case isCancelled && transfer.isOwner: {
                                                const hasTokens = isGoodBignumber(
                                                    new BigNumber(transfer.swapState?.tokenBalance || 0),
                                                )
                                                const hasTons = isGoodBignumber(
                                                    new BigNumber(transfer.swapState?.tonBalance || 0),
                                                )
                                                const hasWtons = isGoodBignumber(
                                                    new BigNumber(transfer.swapState?.wtonBalance || 0),
                                                )

                                                return (
                                                    <div className="btn-group">
                                                        {hasTokens && (
                                                            <Button
                                                                disabled={transfer.swapState?.isWithdrawing}
                                                                key="tokens"
                                                                type="tertiary"
                                                                onClick={transfer.withdrawTokens}
                                                            >
                                                                {intl.formatMessage({
                                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_WITHDRAW_TOKENS_BTN_TEXT',
                                                                }, {
                                                                    symbol: transfer.token?.symbol || '',
                                                                })}
                                                            </Button>
                                                        )}
                                                        {hasWtons && (
                                                            <Button
                                                                disabled={transfer.swapState?.isWithdrawing}
                                                                key="wtons"
                                                                type="tertiary"
                                                                onClick={transfer.withdrawWtons}
                                                            >
                                                                {intl.formatMessage({
                                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_WITHDRAW_WTON_BTN_TEXT',
                                                                })}
                                                            </Button>
                                                        )}
                                                        {hasTons && (
                                                            <Button
                                                                disabled={transfer.swapState?.isWithdrawing}
                                                                key="ton"
                                                                type="tertiary"
                                                                onClick={transfer.withdrawTons}
                                                            >
                                                                {intl.formatMessage({
                                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_WITHDRAW_TONS_BTN_TEXT',
                                                                })}
                                                            </Button>
                                                        )}
                                                    </div>
                                                )
                                            }

                                            default:
                                                return null
                                        }
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
