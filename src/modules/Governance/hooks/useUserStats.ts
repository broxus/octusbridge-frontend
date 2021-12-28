import * as React from 'react'

import { UserStatsStore } from '@/modules/Governance/stores'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useTonWallet } from '@/stores/TonWalletService'

export function useUserStats(): UserStatsStore {
    const ref = React.useRef<UserStatsStore>()
    ref.current = ref.current || new UserStatsStore(
        useTonWallet(),
        useUserData(),
    )
    return ref.current
}
