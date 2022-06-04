import * as React from 'react'
import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { SwapStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'
import { isGoodBignumber } from '@/utils'


function SwapStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const everWallet = transfer.useEverWallet
    const isEventConfirmed = transfer.eventState?.status === 'confirmed'
    const status = transfer.swapState?.status || 'disabled'
    const isConfirmed = status === 'confirmed'
    const isCancelled = transfer.creditProcessorState === CreditProcessorState.Cancelled
    const isProcessorEventConfirmed = (
        transfer.creditProcessorState === CreditProcessorState.EventConfirmed
    )
    const isProcessorStuckEvent = transfer.creditProcessorState !== undefined ? [
        CreditProcessorState.EventConfirmed,
        CreditProcessorState.SwapFailed,
        CreditProcessorState.SwapUnknown,
        CreditProcessorState.UnwrapFailed,
        CreditProcessorState.ProcessRequiresGas,
    ].includes(transfer.creditProcessorState) : false
    const waitingWallet = (
        !everWallet.isReady
        && isEventConfirmed
        && !isConfirmed
        && !isCancelled
    )

    return (
        <SwapStatus
            creditProcessorState={transfer.creditProcessorState}
            isCanceling={transfer.swapState?.isCanceling}
            isProcessing={transfer.swapState?.isProcessing}
            isWithdrawing={transfer.swapState?.isWithdrawing}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_NOTE',
            })}
            status={status}
            waitingWallet={waitingWallet}
        >
            {(() => {
                if (everWallet.isInitializing) {
                    return null
                }

                const displayProcessBtn = (
                    transfer.isDeployer
                    && isProcessorEventConfirmed
                )
                const displayCancelBtn = isProcessorStuckEvent && ((
                    transfer.swapState?.isStuck
                    && transfer.isOwner
                ) || transfer.isDeployer)

                switch (true) {
                    case displayProcessBtn || displayCancelBtn:
                        if (waitingWallet) {
                            return (
                                <Button
                                    disabled={everWallet.isConnecting || everWallet.isConnected}
                                    type="primary"
                                    onClick={everWallet.connect}
                                >
                                    {intl.formatMessage({
                                        id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                                    })}
                                </Button>
                            )
                        }

                        return (
                            <div className="btn-group">
                                {displayProcessBtn && (
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
                                {displayCancelBtn && (
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
                                )}
                            </div>
                        )

                    case isCancelled && transfer.isOwner: {
                        if (waitingWallet) {
                            return (
                                <Button
                                    disabled={everWallet.isConnecting || everWallet.isConnected}
                                    type="primary"
                                    onClick={everWallet.connect}
                                >
                                    {intl.formatMessage({
                                        id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                                    })}
                                </Button>
                            )
                        }

                        const hasTokens = isGoodBignumber(
                            new BigNumber(transfer.swapState?.tokenBalance || 0),
                        )
                        const hasEvers = isGoodBignumber(
                            new BigNumber(transfer.swapState?.everBalance || 0),
                        )
                        const hasWevers = isGoodBignumber(
                            new BigNumber(transfer.swapState?.weverBalance || 0),
                        )

                        if (!hasTokens && !hasEvers && !hasWevers) {
                            return null
                        }

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
                                {hasWevers && (
                                    <Button
                                        disabled={transfer.swapState?.isWithdrawing}
                                        key="wtons"
                                        type="tertiary"
                                        onClick={transfer.withdrawWevers}
                                    >
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_SWAP_WITHDRAW_WTON_BTN_TEXT',
                                        })}
                                    </Button>
                                )}
                                {hasEvers && (
                                    <Button
                                        disabled={transfer.swapState?.isWithdrawing}
                                        key="ton"
                                        type="tertiary"
                                        onClick={transfer.withdrawEvers}
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
            })()}
        </SwapStatus>
    )
}

export const SwapStatusIndicator = observer(SwapStatusIndicatorInner)
