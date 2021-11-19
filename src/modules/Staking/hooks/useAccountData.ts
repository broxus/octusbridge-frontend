import * as React from 'react'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useAccountData(
    tokensCache: TokensCacheService = useTokensCache(),
    tonWallet: TonWalletService = useTonWallet(),
): AccountDataStore {
    const ref = React.useRef<AccountDataStore>()
    ref.current = ref.current || new AccountDataStore(tokensCache, tonWallet)
    return ref.current
}
