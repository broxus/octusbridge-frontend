import * as React from 'react'

import { RelayerStore } from '@/modules/Relayers/store/Relayer'

export function useRelayerStore(): RelayerStore {
    const ref = React.useRef<RelayerStore>()
    ref.current = ref.current || new RelayerStore()
    return ref.current
}
