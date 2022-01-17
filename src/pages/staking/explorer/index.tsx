import * as React from 'react'

import { Explorer } from '@/modules/Staking/Explorer'
import { StakeholdersProvider } from '@/modules/Staking/providers/StakeholdersProvider'
import { ExplorerProvider } from '@/modules/Staking/providers/ExplorerProvider'

export default function Page(): JSX.Element {
    return (
        <StakeholdersProvider>
            <ExplorerProvider>
                <Explorer />
            </ExplorerProvider>
        </StakeholdersProvider>
    )
}
