import * as React from 'react'

import { RelayersEventsStore } from '@/modules/Relayers/store'

export function useRelayersEventsStore(): RelayersEventsStore {
    const ref = React.useRef<RelayersEventsStore>()
    ref.current = ref.current || new RelayersEventsStore()
    return ref.current
}
