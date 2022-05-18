import * as React from 'react'

import { TransferEventStore } from '@/modules/Relayers/store'
import { TokensCacheService } from '@/stores/TokensCacheService'

export function useTransferEventStore(tokensCache: TokensCacheService): TransferEventStore {
    const ref = React.useRef<TransferEventStore>()
    ref.current = ref.current || new TransferEventStore(tokensCache)
    return ref.current
}
