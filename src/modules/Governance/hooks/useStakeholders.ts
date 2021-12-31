import * as React from 'react'

import { StakeholdersStore } from '@/modules/Governance/stores'

export function useStakeholders(): StakeholdersStore {
    const ref = React.useRef<StakeholdersStore>()
    ref.current = ref.current || new StakeholdersStore()
    return ref.current
}
