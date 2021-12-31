import * as React from 'react'

import { Overview } from '@/modules/Governance/Overview'
import { ExplorerStoreProvider } from '@/modules/Staking/providers/ExplorerStoreProvider'

export default function Page(): JSX.Element {
    return (
        <ExplorerStoreProvider>
            <Overview />
        </ExplorerStoreProvider>
    )
}
