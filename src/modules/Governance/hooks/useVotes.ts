import * as React from 'react'

import { VotesStore } from '@/modules/Governance/stores/Votes'

export function useVotesStore(): VotesStore {
    const ref = React.useRef<VotesStore>()
    ref.current = ref.current || new VotesStore()
    return ref.current
}
