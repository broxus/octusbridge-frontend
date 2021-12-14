import * as React from 'react'

import { StakingFormStore } from '@/modules/Staking/stores/StakingForm'
import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useStakingForm(
    accountData: AccountDataStore,
    tokensCache: TokensCacheService = useTokensCache(),
    tonWallet: TonWalletService = useTonWallet(),
): StakingFormStore {
    const ref = React.useRef<StakingFormStore>()
    ref.current = ref.current || new StakingFormStore(
        accountData,
        tokensCache,
        tonWallet,
    )
    return ref.current
}
