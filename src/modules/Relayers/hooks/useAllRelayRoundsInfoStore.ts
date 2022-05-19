import * as React from 'react'

import { AllRelayRoundsInfoStore } from '@/modules/Relayers/store'

export function useAllRelayRoundsInfoStore(): AllRelayRoundsInfoStore {
    const ref = React.useRef<AllRelayRoundsInfoStore>()
    ref.current = ref.current || new AllRelayRoundsInfoStore()
    return ref.current
}
