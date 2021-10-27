import * as React from 'react'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { INDICATOR_LABEL_INTL_ID_BY_STATUS } from '@/modules/Relayers/constants'

type Props = {
    status: | 'pending' | 'confirmed' | 'disabled';
}

export function CreateRelayerStatusIndicator({
    status,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <StatusIndicator status={status}>
            {intl.formatMessage({
                id: INDICATOR_LABEL_INTL_ID_BY_STATUS[status],
            })}
        </StatusIndicator>
    )
}
