import * as React from 'react'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useAccountData(
    tokensCache: TokensCacheService = useTokensCache(),
    tonWallet: TonWalletService = useTonWallet(),
): AccountDataStore {
    const accountDataRef = React.useRef(new AccountDataStore(tokensCache, tonWallet))

    return accountDataRef.current
}
