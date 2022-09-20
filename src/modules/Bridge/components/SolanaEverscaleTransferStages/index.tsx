import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/SolanaEverscaleTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/SolanaEverscaleTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/SolanaEverscaleTransferStages/ReleaseStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/SolanaEverscaleTransferStages/TransferStatusIndicator'


export function SolanaEverscaleTransferStages(): JSX.Element {
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
