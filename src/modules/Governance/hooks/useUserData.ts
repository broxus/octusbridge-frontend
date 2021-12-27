import * as React from 'react'

import { UserDataStore } from '@/modules/Governance/stores'
import { useTonWallet } from '@/stores/TonWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'

export function useUserData(): UserDataStore {
    const ref = React.useRef<UserDataStore>()
    ref.current = ref.current || new UserDataStore(
        useTonWallet(),
        useTokensCache(),
    )
    return ref.current
}
