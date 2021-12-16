import * as React from 'react'

import { ProposalStore } from '@/modules/Governance/stores/Proposal'
import { useUserData } from '@/modules/Governance/stores/UserData'
import { useProposalConfig } from '@/modules/Governance/hooks/useProposalConfig'
import { useTonWallet } from '@/stores/TonWalletService'

export function useProposal(): ProposalStore {
    const ref = React.useRef<ProposalStore>()
    ref.current = ref.current || new ProposalStore(
        useTonWallet(),
        useProposalConfig(),
        useUserData(),
    )
    return ref.current
}
