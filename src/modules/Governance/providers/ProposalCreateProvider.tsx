import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { useProposalCreate } from '@/modules/Governance/hooks'
import { ProposalCreateStore } from '@/modules/Governance/stores'
import { error } from '@/utils'

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

export function ProposalCreateStoreProviderInner({
    children,
}: Props): JSX.Element {
    const proposalCreate = useProposalCreate()

    const fetch = async () => {
        if (!proposalCreate.connected) {
            return
        }
        try {
            await proposalCreate.fetch()
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        if (proposalCreate.connected) {
            fetch()
        }
        else {
            proposalCreate.dispose()
        }
    }, [proposalCreate.connected])

    return (
        <ProposalCreateContext.Provider value={proposalCreate}>
            {children}
        </ProposalCreateContext.Provider>
    )
}

export const ProposalCreateStoreProvider = observer(ProposalCreateStoreProviderInner)
