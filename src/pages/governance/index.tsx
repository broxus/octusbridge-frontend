import * as React from 'react'

import { Overview } from '@/modules/Governance/Overview'
import { ExplorerProvider } from '@/modules/Staking/providers/ExplorerProvider'

export default function Page(): JSX.Element {
    return (
        <ExplorerProvider>
            <Overview />
        </ExplorerProvider>
    )
}
