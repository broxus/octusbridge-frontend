import * as React from 'react'

import { FirstEventStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/FirstEventStatusIndicator'
import { FirstPrepareStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/FirstPrepareStatusIndicator'
import { ReleaseInEvmStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/ReleaseInEvmStatusIndicator'
import { ReleaseInEverscaleStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/ReleaseInEverscaleStatusIndicator'
import { SecondEventStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/SecondEventStatusIndicator'
import { SecondPrepareStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/SecondPrepareStatusIndicator'
import { SwapStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/SwapStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmHiddenSwapTransferForm/TransferStatusIndicator'


export function EvmHiddenSwapTransferForm(): JSX.Element {
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
