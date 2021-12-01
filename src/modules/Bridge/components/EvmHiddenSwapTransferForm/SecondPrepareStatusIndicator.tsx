import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'
import { getTonMainNetwork } from '@/utils'


function SecondPrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const tonWallet = transfer.useTonWallet
    const isSwapConfirmed = transfer.swapState?.status === 'confirmed'
    const { status = 'disabled' } = { ...transfer.secondPrepareState }
    const isConfirmed = status === 'confirmed'
    const waitingWallet = !tonWallet.isReady && isSwapConfirmed && !isConfirmed

    return (
        <PrepareStatus
            isCancelled={transfer.creditProcessorState === CreditProcessorState.Cancelled}
            isDeployed={transfer.contractAddress !== undefined}
            isDeploying={transfer.contractAddress === undefined && status === 'pending'}
            isTransferPage
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_SECOND_NOTE',
            }, {
                network: getTonMainNetwork()?.label || '',
            })}
            status={status}
            txHash={transfer.contractAddress?.toString()}
            waitingWallet={waitingWallet}
        />
    )
}

export const SecondPrepareStatusIndicator = observer(SecondPrepareStatusIndicatorInner)

