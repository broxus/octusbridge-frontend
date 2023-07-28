import * as React from 'react'

import { FirstEventStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/FirstEventStatusIndicator'
import { FirstPrepareStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/FirstPrepareStatusIndicator'
import { ReleaseInEvmStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/ReleaseInEvmStatusIndicator'
import { ReleaseInTvmStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/ReleaseInTvmStatusIndicator'
import { SecondEventStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/SecondEventStatusIndicator'
import { SecondPrepareStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/SecondPrepareStatusIndicator'
import { TransferStatusIndicator } from '@/modules/Bridge/components/EvmEvmTransferStages/TransferStatusIndicator'

export function EvmEvmTransferStages(): JSX.Element {
    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <TransferStatusIndicator />
                <FirstPrepareStatusIndicator />
                <FirstEventStatusIndicator />
                <ReleaseInTvmStatusIndicator />
                <SecondPrepareStatusIndicator />
                <SecondEventStatusIndicator />
                <ReleaseInEvmStatusIndicator />
            </div>
        </div>
    )
}
