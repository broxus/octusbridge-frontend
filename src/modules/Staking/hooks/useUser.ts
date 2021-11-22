import * as React from 'react'

import { UserStore } from '@/modules/Staking/stores/User'

export function useUser(): UserStore {
    const ref = React.useRef<UserStore>()
    ref.current = ref.current || new UserStore()
    return ref.current
}
