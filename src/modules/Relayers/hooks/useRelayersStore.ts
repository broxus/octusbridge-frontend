import * as React from 'react'

import { RelayersStore } from '@/modules/Relayers/store/Relayers'

export function useRelayersStore(): RelayersStore {
    const ref = React.useRef<RelayersStore>()
    ref.current = ref.current || new RelayersStore()
    return ref.current
}
