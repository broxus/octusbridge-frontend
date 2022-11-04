import * as React from 'react'

import { ProposalCreate } from '@/modules/Governance/ProposalCreate'
import { ProposalCreateStoreProvider, UserDataProvider } from '@/modules/Governance/providers'
import { DaoConfigProvider } from '@/modules/Governance/providers/DaoConfigProvider'

export default function Page(): JSX.Element {
    return (
        <DaoConfigProvider>
            <UserDataProvider>
                <ProposalCreateStoreProvider>
                    <ProposalCreate />
                </ProposalCreateStoreProvider>
            </UserDataProvider>
        </DaoConfigProvider>
    )
}
