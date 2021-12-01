import * as React from 'react'

import { ProposalsStore } from '@/modules/Governance/stores/Proposals'

export function useProposals(): ProposalsStore {
    const ref = React.useRef<ProposalsStore>()
    ref.current = ref.current || new ProposalsStore()
    return ref.current
}
