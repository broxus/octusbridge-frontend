import * as React from 'react'

import { useProposalCreate } from '@/modules/Governance/hooks'
import { ProposalCreateStore } from '@/modules/Governance/stores'
import { useEverWallet } from '@/stores/EverWalletService'
import { useContext } from '@/hooks'
import { UserDataContext } from '@/modules/Governance/providers/UserDataProvider'
import { DaoConfigContext } from '@/modules/Governance/providers/DaoConfigProvider'

export const ProposalCreateContext = React.createContext<ProposalCreateStore | undefined>(undefined)

export function useProposalCreateContext(): ProposalCreateStore {
    const ctx = React.useContext(ProposalCreateContext)

    if (ctx === undefined) {
        throw new Error('Proposal create context must be defined')
    }

    return ctx
}

type Props = {
    children: React.ReactNode;
}

export function ProposalCreateStoreProvider({
    children,
}: Props): JSX.Element {
    const wallet = useEverWallet()
    const userData = useContext(UserDataContext)
    const config = useContext(DaoConfigContext)
    const proposalCreate = useProposalCreate(wallet, userData, config)

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
