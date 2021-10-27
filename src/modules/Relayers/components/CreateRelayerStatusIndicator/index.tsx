import * as React from 'react'
import { useIntl } from 'react-intl'

import { Status, StatusIndicator } from '@/components/common/StatusIndicator'
import { INDICATOR_LABEL_INTL_ID_BY_STATUS } from '@/modules/Relayers/constants'
import { ConfirmationStatus } from '@/modules/Relayers/types'

type Props = {
    status: ConfirmationStatus;
}

const relayerStatusMap: Record<string, Status> = {
    confirmed: 'confirmed',
    pending: 'pending',
    checking: 'pending',
    disabled: 'disabled',
}

export function CreateRelayerStatusIndicator({
    status,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <StatusIndicator status={relayerStatusMap[status]}>
            {intl.formatMessage({
                id: INDICATOR_LABEL_INTL_ID_BY_STATUS[status],
            })}
        </StatusIndicator>
    )
}
