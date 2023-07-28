import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses/EventStatus'
import { useEvmEvmPipelineContext } from '@/modules/Bridge/providers'

export const FirstEventStatusIndicator = observer(() => {
    const intl = useIntl()
    const transfer = useEvmEvmPipelineContext()

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
        />
    )
})
