import * as React from 'react'

import { RoundInfoListStore } from '@/modules/Relayers/store'

export function useRoundInfoListStore(relayAddress?: string): RoundInfoListStore {
    const ref = React.useRef<RoundInfoListStore>()
    ref.current = ref.current || new RoundInfoListStore(relayAddress)
    return ref.current
}
