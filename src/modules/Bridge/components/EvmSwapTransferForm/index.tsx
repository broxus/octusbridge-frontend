import * as React from 'react'

import { EventStatusIndicator } from '@/modules/Bridge/components/EvmSwapTransferForm/EventStatusIndicator'
import { PrepareStatusIndicator } from '@/modules/Bridge/components/EvmSwapTransferForm/PrepareStatusIndicator'
import { ReleaseStatusIndicator } from '@/modules/Bridge/components/EvmSwapTransferForm/ReleaseStatusIndicator'
import { SwapStatusIndicator } from '@/modules/Bridge/components/EvmSwapTransferForm/SwapStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmSwapTransferForm/TransferStatusIndicator'


export function EvmSwapTransferForm(): JSX.Element {
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
