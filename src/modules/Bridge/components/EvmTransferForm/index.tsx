import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EvmTransferForm/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EvmTransferForm/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EvmTransferForm/ReleaseStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmTransferForm/TransferStatusIndicator'


export function EvmTransferForm(): JSX.Element {
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
