import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EverscaleTransferForm/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EverscaleTransferForm/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EverscaleTransferForm/ReleaseStatusIndicator'


export function EverscaleTransferForm(): JSX.Element {
    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <PrepareStatusIndicator />
                <EventStatusIndicator />
                <ReleaseStatusIndicator />
            </div>
        </div>
    )
}
