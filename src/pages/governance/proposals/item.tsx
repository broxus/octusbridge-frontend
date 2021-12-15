import * as React from 'react'

import { Proposal } from '@/modules/Governance/Proposal'
import { ProposalStoreProvider, VotingStoreProvider } from '@/modules/Governance/providers'

export default function Page(): JSX.Element {
    return (
        <VotingStoreProvider>
            <ProposalStoreProvider>
                <Proposal />
            </ProposalStoreProvider>
        </VotingStoreProvider>
    )
}
