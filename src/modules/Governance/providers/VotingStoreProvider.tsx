import * as React from 'react'

import { useVoting } from '@/modules/Governance/hooks'
import { VotingStore } from '@/modules/Governance/stores'
import { useEverWallet } from '@/stores/EverWalletService'
import { useContext } from '@/hooks'
import { UserDataContext } from '@/modules/Governance/providers/UserDataProvider'

export const VotingContext = React.createContext<VotingStore | undefined>(undefined)

export function useVotingContext(): VotingStore {
    const votingContext = React.useContext(VotingContext)

    if (!votingContext) {
        throw new Error('Voting context must be defined')
    }

    return votingContext
}

type Props = {
    children: React.ReactNode;
}

export function VotingStoreProvider({
    children,
}: Props): JSX.Element | null {
    const wallet = useEverWallet()
    const userData = useContext(UserDataContext)
    const voting = useVoting(wallet, userData)

    React.useEffect(() => {
        voting.init()

        return () => {
            voting.dispose()
        }
    }, [])

    return (
        <VotingContext.Provider value={voting}>
            {children}
        </VotingContext.Provider>
    )
}
