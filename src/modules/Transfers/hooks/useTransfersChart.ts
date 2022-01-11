import * as React from 'react'

import { TransfersChartStore } from '@/modules/Transfers/stores/TransfersChart'

export function useTransfersChart(): TransfersChartStore {
    const ref = React.useRef<TransfersChartStore>()
    ref.current = ref.current || new TransfersChartStore()
    return ref.current
}
