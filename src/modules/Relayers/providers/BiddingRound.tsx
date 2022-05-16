import * as React from 'react'

import { useBiddingRoundStore } from '@/modules/Relayers/hooks'
import { BiddingRoundStore } from '@/modules/Relayers/store'

export const BiddingRoundContext = React.createContext<BiddingRoundStore | undefined>(undefined)

export function useBiddingRoundContext(): BiddingRoundStore {
    const biddingRoundContext = React.useContext(BiddingRoundContext)

    if (!biddingRoundContext) {
        throw new Error('BiddingRoundContext must be defined')
    }

    return biddingRoundContext
}

type Props = {
    children: React.ReactNode;
}

export function BiddingRoundProvider({
    children,
}: Props): JSX.Element {
    const biddingRound = useBiddingRoundStore()

    return (
        <BiddingRoundContext.Provider value={biddingRound}>
            {children}
        </BiddingRoundContext.Provider>
    )
}
