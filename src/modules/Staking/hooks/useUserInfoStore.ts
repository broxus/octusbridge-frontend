import * as React from 'react'

import { UserInfoStore } from '@/modules/Staking/stores/UserInfo'

export function useUserInfoStore(): UserInfoStore {
    const ref = React.useRef<UserInfoStore>()
    ref.current = ref.current || new UserInfoStore()
    return ref.current
}
