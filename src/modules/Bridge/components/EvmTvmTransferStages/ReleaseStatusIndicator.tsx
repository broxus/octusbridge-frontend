import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useEvmTvmPipelineContext } from '@/modules/Bridge/providers'
import { isEvmTxHashValid } from '@/utils'

export const ReleaseStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEvmTvmPipelineContext()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const rightNetwork = isTransferPage ? transfer.rightNetwork : bridge.rightNetwork

    const status = transfer.eventState?.status || 'disabled'

    return (
        <ReleaseStatus
            isReleased={status === 'pending'}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: rightNetwork?.name || '',
            })}
            status={status}
        />
    )
})
