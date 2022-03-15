import * as React from 'react'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'

export function useAccountData(
    tokensCache: TokensCacheService = useTokensCache(),
    tonWallet: EverWalletService = useEverWallet(),
): AccountDataStore {
    const ref = React.useRef<AccountDataStore>()
    ref.current = ref.current || new AccountDataStore(tokensCache, tonWallet)
    return ref.current
}
