import * as React from 'react'

import { DaoConfigStore } from '@/modules/Governance/stores'
import { EverWalletService } from '@/stores/EverWalletService'

export function useDaoConfig(wallet: EverWalletService): DaoConfigStore {
    const ref = React.useRef<DaoConfigStore>()
    ref.current = ref.current || new DaoConfigStore(wallet)
    return ref.current
}
