import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmEvmPipelineContext } from '@/modules/Bridge/providers'

export const SecondEventStatusIndicator = observer(() => {
    const intl = useIntl()
    const transfer = useEvmEvmPipelineContext()

    const {
        confirmations = 0,
        requiredConfirmations = 0,
        status = 'disabled',
    } = { ...transfer.secondEventState }

    return (
        <EventStatus
            confirmations={confirmations}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_SECOND_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
        />
    )
})
