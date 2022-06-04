import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses/EventStatus'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'


function FirstEventStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const {
        confirmations = 0,
        requiredConfirmations = 0,
        status = 'disabled',
    } = { ...transfer.eventState }

    return (
        <EventStatus
            confirmations={confirmations}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_FIRST_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
            txHash={transfer.deriveEventAddress?.toString()}
        />
    )
}

export const FirstEventStatusIndicator = observer(FirstEventStatusIndicatorInner)
