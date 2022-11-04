import * as React from 'react'

import { ProposalStore } from '@/modules/Governance/stores/Proposal'
import { EverWalletService } from '@/stores/EverWalletService'
import { UserDataStore } from '@/modules/Governance/stores'

export function useProposal(proposalId: number, wallet: EverWalletService, userData: UserDataStore): ProposalStore {
    const ref = React.useRef<ProposalStore>()
    ref.current = ref.current || new ProposalStore(proposalId, wallet, userData)
    return ref.current
}
