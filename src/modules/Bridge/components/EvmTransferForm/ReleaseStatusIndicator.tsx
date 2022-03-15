import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmTransfer } from '@/modules/Bridge/providers'


function ReleaseStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()

    const everWallet = transfer.useEverWallet
    const status = transfer.eventState?.status || 'disabled'
    const waitingWallet = (
        !everWallet.isReady
        && transfer.prepareState?.status === 'confirmed'
        && status !== 'confirmed'
    )

    return (
        <ReleaseStatus
            isReleased={status === 'pending'}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: transfer.rightNetwork?.label || '',
            })}
            status={status}
            waitingWallet={waitingWallet}
        />
    )
}

export const ReleaseStatusIndicator = observer(ReleaseStatusIndicatorInner)
