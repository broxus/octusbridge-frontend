import * as React from 'react'

import { UserStakingStore } from '@/modules/Staking/stores/UserStaking'

export function useUserStaking(): UserStakingStore {
    const ref = React.useRef<UserStakingStore>()
    ref.current = ref.current || new UserStakingStore()
    return ref.current
}
