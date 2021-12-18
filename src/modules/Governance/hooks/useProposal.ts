import * as React from 'react'

import { ProposalStore } from '@/modules/Governance/stores/Proposal'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useTonWallet } from '@/stores/TonWalletService'

export function useProposal(proposalId: number): ProposalStore {
    const ref = React.useRef<ProposalStore>()
    ref.current = ref.current || new ProposalStore(
        proposalId,
        useTonWallet(),
        useUserData(),
    )
    return ref.current
}
