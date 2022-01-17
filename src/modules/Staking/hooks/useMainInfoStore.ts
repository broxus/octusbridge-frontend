import * as React from 'react'

import { MainInfoStore } from '@/modules/Staking/stores'

export function useMainInfoStore(): MainInfoStore {
    const ref = React.useRef<MainInfoStore>()
    ref.current = ref.current || new MainInfoStore()
    return ref.current
}
