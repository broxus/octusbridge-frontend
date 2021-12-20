import * as React from 'react'

import { UserProposalsStore } from '@/modules/Governance/stores/UserProposals'

export function useUserProposal(): UserProposalsStore {
    const ref = React.useRef<UserProposalsStore>()
    ref.current = ref.current || new UserProposalsStore()
    return ref.current
}
