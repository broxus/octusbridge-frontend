import * as React from 'react'

import { RelaysRoundInfoStore } from '@/modules/Relayers/store'

export function useRelaysRoundInfoStore(): RelaysRoundInfoStore {
    const ref = React.useRef<RelaysRoundInfoStore>()
    ref.current = ref.current || new RelaysRoundInfoStore()
    return ref.current
}
