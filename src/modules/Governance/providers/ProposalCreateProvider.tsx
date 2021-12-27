import * as React from 'react'

import { useProposalCreate } from '@/modules/Governance/hooks'
import { ProposalCreateStore } from '@/modules/Governance/stores'

export const ProposalCreateContext = React.createContext<ProposalCreateStore | undefined>(undefined)

export function useProposalCreateContext(): ProposalCreateStore {
    const proposalCreateContext = React.useContext(ProposalCreateContext)

    if (!proposalCreateContext) {
        throw new Error('Proposal create context must be defined')
    }

    return proposalCreateContext
}

type Props = {
    children: React.ReactNode;
}

export function ProposalCreateStoreProvider({
    children,
}: Props): JSX.Element {
    const proposalCreate = useProposalCreate()

    React.useEffect(() => {
        proposalCreate.init()

        return () => {
            proposalCreate.dispose()
        }
    }, [])

    return (
        <ProposalCreateContext.Provider value={proposalCreate}>
            {children}
        </ProposalCreateContext.Provider>
    )
}
