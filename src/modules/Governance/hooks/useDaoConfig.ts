import * as React from 'react'

import { DaoConfigStore } from '@/modules/Governance/stores'
import { useTonWallet } from '@/stores/TonWalletService'

export function useDaoConfig(): DaoConfigStore {
    const ref = React.useRef<DaoConfigStore>()
    ref.current = ref.current || new DaoConfigStore(
        useTonWallet(),
    )
    return ref.current
}
