import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleTransferStages/ReleaseStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleTransferStages/TransferStatusIndicator'


export function EvmEverscaleTransferStages(): JSX.Element {
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
