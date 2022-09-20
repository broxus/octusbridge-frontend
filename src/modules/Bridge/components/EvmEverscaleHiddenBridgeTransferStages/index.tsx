import * as React from 'react'

import { FirstEventStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/FirstEventStatusIndicator'
import { FirstPrepareStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/FirstPrepareStatusIndicator'
import { ReleaseInEvmStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/ReleaseInEvmStatusIndicator'
import { ReleaseInEverscaleStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/ReleaseInEverscaleStatusIndicator'
import { SecondEventStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/SecondEventStatusIndicator'
import { SecondPrepareStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/SecondPrepareStatusIndicator'
import { SwapStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/SwapStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmEverscaleHiddenBridgeTransferStages/TransferStatusIndicator'


export function EvmEverscaleHiddenBridgeTransferStages(): JSX.Element {
    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <TransferStatusIndicator />
                <FirstPrepareStatusIndicator />
                <FirstEventStatusIndicator />
                <ReleaseInEverscaleStatusIndicator />
                <SwapStatusIndicator />
                <SecondPrepareStatusIndicator />
                <SecondEventStatusIndicator />
                <ReleaseInEvmStatusIndicator />
            </div>
        </div>
    )
}
