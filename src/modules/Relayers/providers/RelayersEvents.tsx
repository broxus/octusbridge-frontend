import * as React from 'react'

import { useRelayersEventsStore } from '@/modules/Relayers/hooks'
import { RelayersEventsStore } from '@/modules/Relayers/store'

export const RelayersEventsContext = React.createContext<RelayersEventsStore | undefined>(undefined)

export function useRelayersEventsContext(): RelayersEventsStore {
    const relayersEventsContext = React.useContext(RelayersEventsContext)

    if (!relayersEventsContext) {
        throw new Error('RelayersEventsContext must be defined')
    }

    return relayersEventsContext
}

type Props = {
    children: React.ReactNode;
}

export function RelayersEventsProvider({
    children,
}: Props): JSX.Element {
    const relayersEvents = useRelayersEventsStore()

    return (
        <RelayersEventsContext.Provider value={relayersEvents}>
            {children}
        </RelayersEventsContext.Provider>
    )
}
