import * as React from 'react'

import { useRelayRoundInfoStore } from '@/modules/Relayers/hooks'
import { RelayRoundInfoStore } from '@/modules/Relayers/store'

export const RelayRoundInfoContext = React.createContext<RelayRoundInfoStore | undefined>(undefined)

export function useRelayRoundInfoContext(): RelayRoundInfoStore {
    const relayRoundInfoContext = React.useContext(RelayRoundInfoContext)

    if (!relayRoundInfoContext) {
        throw new Error('RelayRoundInfoContext must be defined')
    }

    return relayRoundInfoContext
}

type Props = {
    children: React.ReactNode;
}

export function RelayRoundInfoProvider({
    children,
}: Props): JSX.Element {
    const relayRoundInfo = useRelayRoundInfoStore()

    return (
        <RelayRoundInfoContext.Provider value={relayRoundInfo}>
            {children}
        </RelayRoundInfoContext.Provider>
    )
}
