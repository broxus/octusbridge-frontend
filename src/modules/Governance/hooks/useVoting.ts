import * as React from 'react'

import { VotingStore } from '@/modules/Governance/stores'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useEverWallet } from '@/stores/EverWalletService'

export function useVoting(): VotingStore {
    const ref = React.useRef<VotingStore>()
    ref.current = ref.current || new VotingStore(
        useEverWallet(),
        useUserData(),
    )
    return ref.current
}
