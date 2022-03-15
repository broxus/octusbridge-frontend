import * as React from 'react'
import BigNumber from 'bignumber.js'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { SwapStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'
import { isGoodBignumber } from '@/utils'


function SwapStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const evmWallet = transfer.useEvmWallet
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
        (!evmWallet.isReady || !everWallet.isReady)
        && isEventConfirmed
        && !isConfirmed
        && !isCancelled
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.leftNetwork !== undefined
        && !isEqual(transfer.leftNetwork.chainId, evmWallet.chainId)
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
            wrongNetwork={wrongNetwork}
        >
            {(() => {
                if (evmWallet.isInitializing || everWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <WalletsConnectors
                            evmWallet={evmWallet}
                            everWallet={everWallet}
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
                        const hasTokens = isGoodBignumber(
                            new BigNumber(transfer.swapState?.tokenBalance || 0),
                        )
                        const hasTons = isGoodBignumber(
                            new BigNumber(transfer.swapState?.tonBalance || 0),
                        )
                        const hasWtons = isGoodBignumber(
                            new BigNumber(transfer.swapState?.wtonBalance || 0),
                        )

                        if (!hasTokens && !hasTons && !hasWtons) {
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
            })()}
        </SwapStatus>
    )
}

export const SwapStatusIndicator = observer(SwapStatusIndicatorInner)
