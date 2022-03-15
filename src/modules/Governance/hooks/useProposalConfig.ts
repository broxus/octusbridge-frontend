import * as React from 'react'

import { ProposalConfigStore } from '@/modules/Governance/stores/ProposalConfig'
import { useEverWallet } from '@/stores/EverWalletService'

export function useProposalConfig(): ProposalConfigStore {
    const ref = React.useRef<ProposalConfigStore>()
    ref.current = ref.current || new ProposalConfigStore(useEverWallet())
    return ref.current
}
