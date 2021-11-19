import * as React from 'react'
import { useIntl } from 'react-intl'

import { Badge, BadgeStatus } from '@/components/common/Badge'
import { Status } from '@/modules/Relayers/types'
import { RELAYER_STATUS_NAME_INTL_ID_BY_STATUS } from '@/modules/Relayers/constants'

type Props = {
    status: Status;
}

const relayerStatusMap: Record<Status, BadgeStatus> = {
    active: 'success',
    disabled: 'warning',
    slashed: 'fail',
    terminated: 'disabled',
    confirmation: 'enabled',
}

export function RelayerStatus({
    status,
}: Props): JSX.Element | null {
    const intl = useIntl()

    return (
        <Badge status={relayerStatusMap[status]}>
            {intl.formatMessage({
                id: RELAYER_STATUS_NAME_INTL_ID_BY_STATUS[status],
            })}
        </Badge>
    )
}
