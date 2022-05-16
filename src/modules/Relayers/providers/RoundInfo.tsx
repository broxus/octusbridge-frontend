import * as React from 'react'

import { useRoundInfoStore } from '@/modules/Relayers/hooks'
import { RoundInfoStore } from '@/modules/Relayers/store'

export const RoundInfoContext = React.createContext<RoundInfoStore | undefined>(undefined)

export function useRoundInfoContext(): RoundInfoStore {
    const roundInfoContext = React.useContext(RoundInfoContext)

    if (!roundInfoContext) {
        throw new Error('RoundInfoContext must be defined')
    }

    return roundInfoContext
}

type Props = {
    children: React.ReactNode;
}

export function RoundInfoProvider({
    children,
}: Props): JSX.Element {
    const roundInfo = useRoundInfoStore()

    return (
        <RoundInfoContext.Provider value={roundInfo}>
            {children}
        </RoundInfoContext.Provider>
    )
}
