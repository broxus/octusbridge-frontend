import * as React from 'react'

import { TransfersStore } from '@/modules/Transfers/stores/Transfers'

export function useTransfers(): TransfersStore {
    const ref = React.useRef<TransfersStore>()
    ref.current = ref.current || new TransfersStore()
    return ref.current
}
