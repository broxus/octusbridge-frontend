import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/TvmEvmTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/TvmEvmTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/TvmEvmTransferStages/ReleaseStatusIndicator'

export const TvmEvmTransferStages = React.memo(() => (
    <div className="card card--flat card--small crosschain-transfer">
        <div className="crosschain-transfer__statuses">
            <PrepareStatusIndicator />
            <EventStatusIndicator />
            <ReleaseStatusIndicator />
        </div>
    </div>
))
