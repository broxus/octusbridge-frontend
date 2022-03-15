import * as React from 'react'

import { RedeemFormStore } from '@/modules/Staking/stores/RedeemForm'
import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'

export function useRedeemForm(
    accountData: AccountDataStore,
    tonWallet: EverWalletService = useEverWallet(),
): RedeemFormStore {
    const ref = React.useRef<RedeemFormStore>()
    ref.current = ref.current || new RedeemFormStore(accountData, tonWallet)
    return ref.current
}
