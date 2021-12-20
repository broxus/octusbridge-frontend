import * as React from 'react'

import { ProposalConfigStore } from '@/modules/Governance/stores/ProposalConfig'
import { useTonWallet } from '@/stores/TonWalletService'

export function useProposalConfig(): ProposalConfigStore {
    const ref = React.useRef<ProposalConfigStore>()
    ref.current = ref.current || new ProposalConfigStore(useTonWallet())
    return ref.current
}
