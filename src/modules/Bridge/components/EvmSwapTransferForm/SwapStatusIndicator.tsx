import BigNumber from 'bignumber.js'
import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/types'
import { isGoodBignumber } from '@/utils'


const creditProcessorDescriptorsMap = [
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
            <div className="crosschain-transfer__status-label">
                <Observer>
                    {() => (
                        <StatusIndicator status={transfer.swapState?.status || 'disabled'}>
                            {(() => {
                                switch (transfer.swapState?.status) {
                                    case 'confirmed':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CONFIRMED',
                                        })

                                    case 'pending': {
                                        let descriptor = !transfer.creditProcessorState
                                            ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_EXCHANGING'
                                            : creditProcessorDescriptorsMap[transfer.creditProcessorState]

                                        if (transfer.creditProcessorState === CreditProcessorState.Cancelled) {
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
                                                : creditProcessorDescriptorsMap[transfer.creditProcessorState],
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: transfer.creditProcessorState === CreditProcessorState.Cancelled
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCELLED'
                                                : 'CROSSCHAIN_TRANSFER_STATUS_SWAP_DISABLED',
                                        })
                                }
                            })()}
                        </StatusIndicator>
                    )}
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
                        switch (true) {
                            case transfer.swapState?.isStuck && transfer.isOwner:
                                return (
                                    <Button
                                        disabled={transfer.swapState?.isCanceling}
                                        type="tertiary"
                                        onClick={transfer.cancel}
                                    >
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_CANCEL_BTN_TEXT',
                                        })}
                                    </Button>
                                )

                            case transfer.creditProcessorState === CreditProcessorState.Cancelled && transfer.isOwner: {
                                const hasTokens = isGoodBignumber(new BigNumber(transfer.swapState?.tokenBalance || 0))
                                const hasTons = isGoodBignumber(new BigNumber(transfer.swapState?.tonBalance || 0))
                                const hasWtons = isGoodBignumber(new BigNumber(transfer.swapState?.wtonBalance || 0))

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
        </div>
    )
}
