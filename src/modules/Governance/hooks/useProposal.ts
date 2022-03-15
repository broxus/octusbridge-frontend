import * as React from 'react'

import { ProposalStore } from '@/modules/Governance/stores/Proposal'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useEverWallet } from '@/stores/EverWalletService'

export function useProposal(proposalId: number): ProposalStore {
    const ref = React.useRef<ProposalStore>()
    ref.current = ref.current || new ProposalStore(
        proposalId,
        useEverWallet(),
        useUserData(),
    )
    return ref.current
}
