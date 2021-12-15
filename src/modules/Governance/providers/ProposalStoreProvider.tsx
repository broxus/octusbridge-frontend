import * as React from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { useProposal } from '@/modules/Governance/hooks'
import { ProposalStore } from '@/modules/Governance/stores'
import { error } from '@/utils'

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

export function ProposalStoreProviderInner({
    children,
}: Props): JSX.Element {
    const proposal = useProposal()
    const routeParams = useParams<RouteParams>()
    const proposalId = parseInt(routeParams.id, 10)

    const fetch = async () => {
        if (!proposalId) {
            return
        }
        try {
            await proposal.fetch(proposalId)
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])

    return (
        <ProposalContext.Provider value={proposal}>
            {children}
        </ProposalContext.Provider>
    )
}

export const ProposalStoreProvider = observer(ProposalStoreProviderInner)
