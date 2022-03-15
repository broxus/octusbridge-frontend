import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork } from '@/utils'


function ReleaseInEverscaleStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const status = transfer.eventState?.status || 'disabled'

    return (
        <ReleaseStatus
            isReleased={status === 'pending'}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: getEverscaleMainNetwork()?.label || '',
            })}
            status={status}
        />
    )
}

export const ReleaseInEverscaleStatusIndicator = observer(ReleaseInEverscaleStatusIndicatorInner)
