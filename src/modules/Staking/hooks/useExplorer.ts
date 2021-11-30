import * as React from 'react'

import { ExplorerStore } from '@/modules/Staking/stores/Explorer'

export function useExplorer(): ExplorerStore {
    const ref = React.useRef<ExplorerStore>()
    ref.current = ref.current || new ExplorerStore()
    return ref.current
}
