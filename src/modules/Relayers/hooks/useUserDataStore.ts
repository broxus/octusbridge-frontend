import * as React from 'react'

import { UserDataStore } from '@/modules/Relayers/store'

export function useUserDataStore(): UserDataStore {
    const ref = React.useRef<UserDataStore>()
    ref.current = ref.current || new UserDataStore()
    return ref.current
}
