import * as React from 'react'

import { RelayInfoStore } from '@/modules/Relayers/store'

export function useRelayInfoStore(): RelayInfoStore {
    const ref = React.useRef<RelayInfoStore>()
    ref.current = ref.current || new RelayInfoStore()
    return ref.current
}
