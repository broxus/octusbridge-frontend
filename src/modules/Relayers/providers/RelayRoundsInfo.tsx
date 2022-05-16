import * as React from 'react'

import { useRelayRoundsInfoStore } from '@/modules/Relayers/hooks'
import { RelayRoundsInfoStore } from '@/modules/Relayers/store'

export const RelayRoundsInfoContext = React.createContext<RelayRoundsInfoStore | undefined>(undefined)

export function useRelayRoundsInfoContext(): RelayRoundsInfoStore {
    const relayRoundsInfoContext = React.useContext(RelayRoundsInfoContext)

    if (!relayRoundsInfoContext) {
        throw new Error('RelayRoundsInfoContext must be defined')
    }

    return relayRoundsInfoContext
}

type Props = {
    children: React.ReactNode;
}

export function RelayRoundsInfoProvider({
    children,
}: Props): JSX.Element {
    const relayRoundsInfo = useRelayRoundsInfoStore()

    return (
        <RelayRoundsInfoContext.Provider value={relayRoundsInfo}>
            {children}
        </RelayRoundsInfoContext.Provider>
    )
}
