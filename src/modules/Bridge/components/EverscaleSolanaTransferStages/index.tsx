import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EverscaleSolanaTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EverscaleSolanaTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EverscaleSolanaTransferStages/ReleaseStatusIndicator'


export function EverscaleSolanaTransferStages(): JSX.Element {
    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <PrepareStatusIndicator />
                <ReleaseStatusIndicator />
                <EventStatusIndicator />
            </div>
        </div>
    )
}
