import * as React from 'react'

import { RelayRoundsInfoStore } from '@/modules/Relayers/store'

export function useRelayRoundsInfoStore(): RelayRoundsInfoStore {
    const ref = React.useRef<RelayRoundsInfoStore>()
    ref.current = ref.current || new RelayRoundsInfoStore()
    return ref.current
}
