import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/TonTransferForm/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/TonTransferForm/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/TonTransferForm/ReleaseStatusIndicator'


export function TonTransferForm(): JSX.Element {
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
