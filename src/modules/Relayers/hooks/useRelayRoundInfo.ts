import * as React from 'react'

import { RelayRoundInfoStore } from '@/modules/Relayers/store'

export function useRelayRoundInfoStore(): RelayRoundInfoStore {
    const ref = React.useRef<RelayRoundInfoStore>()
    ref.current = ref.current || new RelayRoundInfoStore()
    return ref.current
}
