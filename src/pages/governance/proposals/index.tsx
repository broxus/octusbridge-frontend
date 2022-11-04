import * as React from 'react'

import { Proposals } from '@/modules/Governance/Proposals'
import { UserDataProvider, VotingStoreProvider } from '@/modules/Governance/providers'

export default function Page(): JSX.Element {
    return (
        <UserDataProvider>
            <VotingStoreProvider>
                <Proposals />
            </VotingStoreProvider>
        </UserDataProvider>
    )
}
