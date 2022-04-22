import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { EventStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmTransfer } from '@/modules/Bridge/providers'


function EventStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()

    const everWallet = transfer.useEverWallet
    const {
        confirmations = 0,
        requiredConfirmations = 0,
        status = 'disabled',
    } = { ...transfer.eventState }
    const waitingWallet = (
        !everWallet.isReady
        && transfer.prepareState?.status === 'confirmed'
        && status !== 'confirmed'
    )

    return (
        <EventStatus
            confirmations={confirmations}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
            waitingWallet={waitingWallet}
            wrongNetwork={false}
        >
            {(() => {
                if (everWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <Button
                            key="ton"
                            disabled={everWallet.isInitializing || everWallet.isConnecting}
                            type="primary"
                            onClick={everWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                return null
            })()}
        </EventStatus>
    )
}

export const EventStatusIndicator = observer(EventStatusIndicatorInner)
