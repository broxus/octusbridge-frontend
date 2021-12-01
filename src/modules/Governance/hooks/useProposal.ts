import * as React from 'react'

import { ProposalStore } from '@/modules/Governance/stores/Proposal'
import { useTonWallet } from '@/stores/TonWalletService'

export function useProposal(): ProposalStore {
    const ref = React.useRef<ProposalStore>()
    ref.current = ref.current || new ProposalStore(useTonWallet())
    return ref.current
}
