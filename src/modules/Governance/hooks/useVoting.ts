import * as React from 'react'

import { UserDataStore, VotingStore } from '@/modules/Governance/stores'
import { EverWalletService } from '@/stores/EverWalletService'

export function useVoting(wallet: EverWalletService, userData: UserDataStore): VotingStore {
    const ref = React.useRef<VotingStore>()
    ref.current = ref.current || new VotingStore(wallet, userData)
    return ref.current
}
