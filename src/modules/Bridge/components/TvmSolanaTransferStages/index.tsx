import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/TvmSolanaTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/TvmSolanaTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/TvmSolanaTransferStages/ReleaseStatusIndicator'

export function TvmSolanaTransferStages(): JSX.Element {
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
