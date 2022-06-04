import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork } from '@/utils'
import { CreditProcessorState } from '@/modules/Bridge/types'


function FirstPrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const everWallet = transfer.useEverWallet
    const status = transfer.prepareState?.status || 'disabled'
    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const waitingWallet = (
        !everWallet.isReady
        && isTransferConfirmed
        && !isConfirmed
        && !isPending
    )

    return (
        <PrepareStatus
            isBroadcasting={transfer.prepareState?.isBroadcasting}
            isDeployed={transfer.creditProcessorState === undefined ? undefined : (
                transfer.creditProcessorState >= CreditProcessorState.EventConfirmed
                && transfer.creditProcessorState !== CreditProcessorState.EventRejected
            )}
            isDeploying={transfer.creditProcessorState === undefined || (
                transfer.creditProcessorState === CreditProcessorState.EventDeployInProgress
                && !transfer.prepareState?.isOutdated
                && status === 'pending'
            )}
            isTransferPage
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_FIRST_NOTE',
            }, {
                network: getEverscaleMainNetwork()?.label || '',
            })}
            status={status}
            txHash={isConfirmed ? transfer.creditProcessorAddress?.toString() : undefined}
            waitingWallet={waitingWallet}
        >
            {(() => {
                if (everWallet.isInitializing) {
                    return null
                }

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

                if ((
                    transfer.prepareState?.isOutdated === true
                    && transfer.transferState?.confirmedBlocksCount !== undefined
                    && transfer.transferState.eventBlocksToConfirm !== undefined
                    && transfer.transferState.confirmedBlocksCount > transfer.transferState.eventBlocksToConfirm * 3
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
            })()}
        </PrepareStatus>
    )
}

export const FirstPrepareStatusIndicator = observer(FirstPrepareStatusIndicatorInner)
