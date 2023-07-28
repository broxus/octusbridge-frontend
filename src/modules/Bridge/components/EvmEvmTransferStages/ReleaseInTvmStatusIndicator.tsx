import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmEvmPipelineContext } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork } from '@/utils'

export const ReleaseInTvmStatusIndicator = observer(() => {
    const intl = useIntl()
    const transfer = useEvmEvmPipelineContext()

    const status = transfer.eventState?.status || 'disabled'

    return (
        <ReleaseStatus
            isReleased={status === 'pending'}
            note={intl.formatMessage(
                {
                    id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
                },
                {
                    network: getEverscaleMainNetwork()?.label || '',
                },
            )}
            status={status}
        />
    )
})
