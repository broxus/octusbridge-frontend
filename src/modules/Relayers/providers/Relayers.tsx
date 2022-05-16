import * as React from 'react'

import { useRelayersStore } from '@/modules/Relayers/hooks/useRelayersStore'
import { RelayersStore } from '@/modules/Relayers/store/Relayers'

export const RelayersContext = React.createContext<RelayersStore | undefined>(undefined)

export function useRelayersContext(): RelayersStore {
    const relayersContext = React.useContext(RelayersContext)

    if (!relayersContext) {
        throw new Error('RelayersContext must be defined')
    }

    return relayersContext
}

type Props = {
    children: React.ReactNode;
}

export function RelayersProvider({
    children,
}: Props): JSX.Element {
    const relayersStore = useRelayersStore()

    return (
        <RelayersContext.Provider value={relayersStore}>
            {children}
        </RelayersContext.Provider>
    )
}
