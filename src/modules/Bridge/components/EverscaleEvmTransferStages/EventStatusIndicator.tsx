import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses'
import { useEverscaleEvmPipelineContext } from '@/modules/Bridge/providers'

export const EventStatusIndicator = observer(() => {
    const intl = useIntl()
    const transfer = useEverscaleEvmPipelineContext()

    const status = transfer.eventState?.status || 'disabled'
    const { confirmations = 0, requiredConfirmations = 0 } = { ...transfer.eventState }

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
