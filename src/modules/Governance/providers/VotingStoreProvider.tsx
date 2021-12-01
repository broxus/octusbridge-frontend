import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { useVoting } from '@/modules/Governance/hooks'
import { VotingStore } from '@/modules/Governance/stores'
import { error } from '@/utils'

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

export function VotingStoreProviderInner({
    children,
}: Props): JSX.Element {
    const voting = useVoting()

    const fetch = async () => {
        if (!voting.connected) {
            return
        }
        try {
            await voting.fetch()
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [voting.connected])

    return (
        <VotingContext.Provider value={voting}>
            {children}
        </VotingContext.Provider>
    )
}

export const VotingStoreProvider = observer(VotingStoreProviderInner)
