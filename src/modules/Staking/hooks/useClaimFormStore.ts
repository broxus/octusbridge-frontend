import * as React from 'react'

import { ClaimFormStore } from '@/modules/Staking/stores/ClaimForm'
import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useClaimFormStore(
    accountData: AccountDataStore,
    tonWallet: TonWalletService = useTonWallet(),
): ClaimFormStore {
    const ref = React.useRef<ClaimFormStore>()
    ref.current = ref.current || new ClaimFormStore(accountData, tonWallet)
    return ref.current
}
