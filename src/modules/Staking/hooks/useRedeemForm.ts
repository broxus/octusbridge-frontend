import * as React from 'react'

import { RedeemFormStore } from '@/modules/Staking/stores/RedeemForm'
import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useRedeemForm(
    accountData: AccountDataStore,
    tonWallet: TonWalletService = useTonWallet(),
): RedeemFormStore {
    const ref = React.useRef<RedeemFormStore>()
    ref.current = ref.current || new RedeemFormStore(accountData, tonWallet)
    return ref.current
}
