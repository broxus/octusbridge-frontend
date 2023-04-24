import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EverscaleEvmTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EverscaleEvmTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EverscaleEvmTransferStages/ReleaseStatusIndicator'


export const EverscaleEvmTransferStages = React.memo(() => (
    <div className="card card--flat card--small crosschain-transfer">
        <div className="crosschain-transfer__statuses">
            <PrepareStatusIndicator />
            <EventStatusIndicator />
            <ReleaseStatusIndicator />
        </div>
    </div>
    ))
