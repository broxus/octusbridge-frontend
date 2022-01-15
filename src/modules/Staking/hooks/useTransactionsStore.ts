import * as React from 'react'

import { TransactionsStore } from '@/modules/Staking/stores'

export function useTransactionsStore(): TransactionsStore {
    const ref = React.useRef<TransactionsStore>()
    ref.current = ref.current || new TransactionsStore()
    return ref.current
}
