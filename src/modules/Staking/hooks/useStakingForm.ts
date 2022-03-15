import * as React from 'react'

import { StakingFormStore } from '@/modules/Staking/stores/StakingForm'
import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'

export function useStakingForm(
    accountData: AccountDataStore,
    tokensCache: TokensCacheService = useTokensCache(),
    tonWallet: EverWalletService = useEverWallet(),
): StakingFormStore {
    const ref = React.useRef<StakingFormStore>()
    ref.current = ref.current || new StakingFormStore(
        accountData,
        tokensCache,
        tonWallet,
    )
    return ref.current
}
