import * as React from 'react'

import { Explorer } from '@/modules/Staking/Explorer'
import { ExplorerStoreProvider } from '@/modules/Staking/providers/ExplorerStoreProvider'

export default function Page(): JSX.Element {
    return (
        <div className="container container--large">
            <ExplorerStoreProvider>
                <Explorer />
            </ExplorerStoreProvider>
        </div>
    )
}
