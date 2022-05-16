import * as React from 'react'

import { BiddingRoundStore } from '@/modules/Relayers/store'

export function useBiddingRoundStore(): BiddingRoundStore {
    const ref = React.useRef<BiddingRoundStore>()
    ref.current = ref.current || new BiddingRoundStore()
    return ref.current
}
