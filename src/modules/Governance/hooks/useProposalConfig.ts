import * as React from 'react'

import { ProposalConfigStore } from '@/modules/Governance/stores/ProposalConfig'

export function useProposalConfig(): ProposalConfigStore {
    const ref = React.useRef<ProposalConfigStore>()
    ref.current = ref.current || new ProposalConfigStore()
    return ref.current
}
