import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleCreditTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleCreditTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleCreditTransferStages/ReleaseStatusIndicator'
import { SwapStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleCreditTransferStages/SwapStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleCreditTransferStages/TransferStatusIndicator'


export function EvmEverscaleCreditTransferStages(): JSX.Element {
    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <TransferStatusIndicator />
                <PrepareStatusIndicator />
                <EventStatusIndicator />
                <ReleaseStatusIndicator />
                <SwapStatusIndicator />
            </div>
        </div>
    )
}
