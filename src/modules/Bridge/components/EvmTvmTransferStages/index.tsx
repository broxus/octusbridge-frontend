import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EvmTvmTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EvmTvmTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EvmTvmTransferStages/ReleaseStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmTvmTransferStages/TransferStatusIndicator'

export function EvmTvmTransferStages(): JSX.Element {
    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <TransferStatusIndicator />
                <PrepareStatusIndicator />
                <EventStatusIndicator />
                <ReleaseStatusIndicator />
            </div>
        </div>
    )
}
