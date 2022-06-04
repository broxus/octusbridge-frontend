import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'
import { getEverscaleMainNetwork } from '@/utils'


function SecondPrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const { status = 'disabled' } = { ...transfer.secondPrepareState }

    return (
        <PrepareStatus
            isCancelled={transfer.creditProcessorState === CreditProcessorState.Cancelled}
            isDeployed={transfer.contractAddress !== undefined}
            isDeploying={transfer.contractAddress === undefined && status === 'pending'}
            isTransferPage
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_SECOND_NOTE',
            }, {
                network: getEverscaleMainNetwork()?.label || '',
            })}
            status={status}
            txHash={transfer.contractAddress?.toString()}
        />
    )
}

export const SecondPrepareStatusIndicator = observer(SecondPrepareStatusIndicatorInner)

