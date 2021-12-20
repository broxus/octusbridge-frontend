import * as React from 'react'

import { Proposals } from '@/modules/Governance/Proposals'
import { VotingStoreProvider } from '@/modules/Governance/providers'

export default function Page(): JSX.Element {
    return (
        <VotingStoreProvider>
            <Proposals />
        </VotingStoreProvider>
    )
}
