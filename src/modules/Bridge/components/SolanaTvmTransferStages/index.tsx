import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/SolanaTvmTransferStages/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/SolanaTvmTransferStages/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/SolanaTvmTransferStages/ReleaseStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/SolanaTvmTransferStages/TransferStatusIndicator'

export function SolanaTvmTransferStages(): JSX.Element {
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
