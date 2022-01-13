import * as React from 'react'

import { TransfersStatsStore } from '@/modules/Transfers/stores/TransfersStats'

export function useTransfersStats(): TransfersStatsStore {
    const ref = React.useRef<TransfersStatsStore>()
    ref.current = ref.current || new TransfersStatsStore()
    return ref.current
}
