import * as React from 'react'

import { UserDataStore } from '@/modules/Governance/stores'
import { useTokensCache } from '@/stores/TokensCacheService'
import { useEverWallet } from '@/stores/EverWalletService'

export function useUserData(): UserDataStore {
    const ref = React.useRef<UserDataStore>()
    ref.current = ref.current || new UserDataStore(
        useEverWallet(),
        useTokensCache(),
    )
    return ref.current
}
