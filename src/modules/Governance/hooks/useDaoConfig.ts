import * as React from 'react'

import { DaoConfigStore } from '@/modules/Governance/stores'
import { useEverWallet } from '@/stores/EverWalletService'

export function useDaoConfig(): DaoConfigStore {
    const ref = React.useRef<DaoConfigStore>()
    ref.current = ref.current || new DaoConfigStore(
        useEverWallet(),
    )
    return ref.current
}
