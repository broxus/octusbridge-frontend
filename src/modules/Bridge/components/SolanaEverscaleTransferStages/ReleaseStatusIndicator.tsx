import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useSolanaEverscalePipelineContext } from '@/modules/Bridge/providers'


function ReleaseStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useSolanaEverscalePipelineContext()

    const status = transfer.eventState?.status || 'disabled'

    return (
        <ReleaseStatus
            isReleased={status === 'pending'}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: bridge.rightNetwork?.label || transfer.rightNetwork?.label || '',
            })}
            status={status}
        />
    )
}

export const ReleaseStatusIndicator = observer(ReleaseStatusIndicatorInner)
