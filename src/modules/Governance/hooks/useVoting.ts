import * as React from 'react'

import { VotingStore } from '@/modules/Governance/stores'
import { useTonWallet } from '@/stores/TonWalletService'

export function useVoting(): VotingStore {
    const ref = React.useRef<VotingStore>()
    ref.current = ref.current || new VotingStore(useTonWallet())
    return ref.current
}
