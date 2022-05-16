import * as React from 'react'

import { TransferEventStore } from '@/modules/Relayers/store'

export function useTransferEventStore(): TransferEventStore {
    const ref = React.useRef<TransferEventStore>()
    ref.current = ref.current || new TransferEventStore()
    return ref.current
}
