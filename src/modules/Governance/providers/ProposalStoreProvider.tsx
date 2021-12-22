import * as React from 'react'
import { useParams } from 'react-router-dom'

import { useProposal } from '@/modules/Governance/hooks'
import { ProposalStore } from '@/modules/Governance/stores'

export const ProposalContext = React.createContext<ProposalStore | undefined>(undefined)

export function useProposalContext(): ProposalStore {
    const proposalContext = React.useContext(ProposalContext)

    if (!proposalContext) {
        throw new Error('Proposal context must be defined')
    }

    return proposalContext
}

type Props = {
    children: React.ReactNode;
}

type RouteParams = {
    id: string;
}

export function ProposalStoreProvider({
    children,
}: Props): JSX.Element {
    const routeParams = useParams<RouteParams>()
    const proposalId = parseInt(routeParams.id, 10)
    const proposal = useProposal(proposalId)

    React.useEffect(() => {
        proposal.init()

        return () => {
            proposal.dispose()
        }
    }, [])

    return (
        <ProposalContext.Provider value={proposal}>
            {children}
        </ProposalContext.Provider>
    )
}
