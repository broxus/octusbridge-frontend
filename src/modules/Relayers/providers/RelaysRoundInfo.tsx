import * as React from 'react'

import { useRelaysRoundInfoStore } from '@/modules/Relayers/hooks'
import { RelaysRoundInfoStore } from '@/modules/Relayers/store'

export const RelaysRoundInfoContext = React.createContext<RelaysRoundInfoStore | undefined>(undefined)

export function useRelaysRoundInfoContext(): RelaysRoundInfoStore {
    const relaysRoundInfoContext = React.useContext(RelaysRoundInfoContext)

    if (!relaysRoundInfoContext) {
        throw new Error('RelaysRoundInfoContext must be defined')
    }

    return relaysRoundInfoContext
}

type Props = {
    children: React.ReactNode;
}

export function RelaysRoundInfoProvider({
    children,
}: Props): JSX.Element {
    const relaysRoundInfo = useRelaysRoundInfoStore()

    return (
        <RelaysRoundInfoContext.Provider value={relaysRoundInfo}>
            {children}
        </RelaysRoundInfoContext.Provider>
    )
}
