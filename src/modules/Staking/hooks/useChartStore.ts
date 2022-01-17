import * as React from 'react'

import { ChartStore } from '@/modules/Staking/stores'

export function useChartStore(): ChartStore {
    const ref = React.useRef<ChartStore>()
    ref.current = ref.current || new ChartStore()
    return ref.current
}
