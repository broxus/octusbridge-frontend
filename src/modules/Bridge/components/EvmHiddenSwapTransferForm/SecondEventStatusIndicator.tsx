import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'


function SecondEventStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const {
        confirmations = 0,
        requiredConfirmations = 0,
        status = 'disabled',
    } = { ...transfer.secondEventState }

    return (
        <EventStatus
            confirmations={confirmations}
            isCancelled={transfer.creditProcessorState === CreditProcessorState.Cancelled}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_SECOND_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
        />
    )
}

export const SecondEventStatusIndicator = observer(SecondEventStatusIndicatorInner)
