import * as React from 'react'

import { RoundInfoStore } from '@/modules/Relayers/store'

export function useRoundInfoStore(): RoundInfoStore {
    const ref = React.useRef<RoundInfoStore>()
    ref.current = ref.current || new RoundInfoStore()
    return ref.current
}
