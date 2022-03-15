import * as React from 'react'

import { ClaimFormStore } from '@/modules/Staking/stores/ClaimForm'
import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'

export function useClaimFormStore(
    accountData: AccountDataStore,
    tonWallet: EverWalletService = useEverWallet(),
): ClaimFormStore {
    const ref = React.useRef<ClaimFormStore>()
    ref.current = ref.current || new ClaimFormStore(accountData, tonWallet)
    return ref.current
}
