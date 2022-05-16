import * as React from 'react'

import { useRelayInfoStore } from '@/modules/Relayers/hooks'
import { RelayInfoStore } from '@/modules/Relayers/store'

export const RelayInfoContext = React.createContext<RelayInfoStore | undefined>(undefined)

export function useRelayInfoContext(): RelayInfoStore {
    const relayInfoContext = React.useContext(RelayInfoContext)

    if (!relayInfoContext) {
        throw new Error('RelayInfoContext must be defined')
    }

    return relayInfoContext
}

type Props = {
    children: React.ReactNode;
}

export function RelayInfoProvider({
    children,
}: Props): JSX.Element {
    const relayInfo = useRelayInfoStore()

    return (
        <RelayInfoContext.Provider value={relayInfo}>
            {children}
        </RelayInfoContext.Provider>
    )
}
