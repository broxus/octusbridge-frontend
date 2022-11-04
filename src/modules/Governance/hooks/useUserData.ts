import * as React from 'react'

import { UserDataStore } from '@/modules/Governance/stores'
import { TokensCacheService } from '@/stores/TokensCacheService'
import { EverWalletService } from '@/stores/EverWalletService'

export function useUserData(wallet: EverWalletService, tokensCache: TokensCacheService): UserDataStore {
    const ref = React.useRef<UserDataStore>()
    ref.current = ref.current || new UserDataStore(wallet, tokensCache)
    return ref.current
}
