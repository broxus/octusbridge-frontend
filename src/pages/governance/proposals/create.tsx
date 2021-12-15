import * as React from 'react'

import { ProposalCreate } from '@/modules/Governance/ProposalCreate'
import { ProposalCreateStoreProvider } from '@/modules/Governance/providers'

export default function Page(): JSX.Element {
    return (
        <ProposalCreateStoreProvider>
            <ProposalCreate />
        </ProposalCreateStoreProvider>
    )
}
