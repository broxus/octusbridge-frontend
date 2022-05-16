import * as React from 'react'

import { BiddingRound } from '@/modules/Relayers/BiddingRound'
import { BiddingRoundProvider, RelayRoundInfoProvider, RoundInfoProvider } from '@/modules/Relayers/providers'

export default function Page(): JSX.Element {
    return (
        <RelayRoundInfoProvider>
            <RoundInfoProvider>
                <BiddingRoundProvider>
                    <BiddingRound />
                </BiddingRoundProvider>
            </RoundInfoProvider>
        </RelayRoundInfoProvider>
    )
}
