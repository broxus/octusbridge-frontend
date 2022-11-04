import * as React from 'react'

import { Proposal } from '@/modules/Governance/Proposal'
import { ProposalStoreProvider, UserDataProvider, VotingStoreProvider } from '@/modules/Governance/providers'

export default function Page(): JSX.Element {
    return (
        <UserDataProvider>
            <VotingStoreProvider>
                <ProposalStoreProvider>
                    <Proposal />
                </ProposalStoreProvider>
            </VotingStoreProvider>
        </UserDataProvider>
    )
}
