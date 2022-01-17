import * as React from 'react'

import { TransfersStatsProvider } from '@/modules/Transfers/providers'
import { Transfers } from '@/modules/Transfers'

export default function Page(): JSX.Element {
    return (
        <TransfersStatsProvider>
            <Transfers />
        </TransfersStatsProvider>
    )
}
