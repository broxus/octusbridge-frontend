import * as React from 'react'

import { StakeholdersStore } from '@/modules/Staking/stores/Stakeholders'

export function useStakeholdersStore(): StakeholdersStore {
    const ref = React.useRef<StakeholdersStore>()
    ref.current = ref.current || new StakeholdersStore()
    return ref.current
}
