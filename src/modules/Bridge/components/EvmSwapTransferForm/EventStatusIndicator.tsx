import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'


function EventStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmSwapTransfer()

    const {
        confirmations = 0,
        requiredConfirmations = 0,
        status = 'disabled',
    } = { ...transfer.eventState }

    return (
        <EventStatus
            confirmations={confirmations}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
            txHash={transfer.deriveEventAddress?.toString()}
        />
    )
}

export const EventStatusIndicator = observer(EventStatusIndicatorInner)
