import * as React from 'react'

import { useAllRelayRoundsInfoStore } from '@/modules/Relayers/hooks'
import { AllRelayRoundsInfoStore } from '@/modules/Relayers/store'

export const AllRelayRoundsInfoContext = React.createContext<AllRelayRoundsInfoStore | undefined>(undefined)

export function useAllRelayRoundsInfoContext(): AllRelayRoundsInfoStore {
    const allRelayRoundsInfoContext = React.useContext(AllRelayRoundsInfoContext)

    if (!allRelayRoundsInfoContext) {
        throw new Error('AllRelayRoundsInfoContext must be defined')
    }

    return allRelayRoundsInfoContext
}

type Props = {
    children: React.ReactNode;
}

export function AllRelayRoundsInfoProvider({
    children,
}: Props): JSX.Element {
    const allRelayRoundsInfo = useAllRelayRoundsInfoStore()

    return (
        <AllRelayRoundsInfoContext.Provider value={allRelayRoundsInfo}>
            {children}
        </AllRelayRoundsInfoContext.Provider>
    )
}
