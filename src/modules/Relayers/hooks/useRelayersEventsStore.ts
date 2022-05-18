import * as React from 'react'

import { RelayersEventsStore } from '@/modules/Relayers/store'
import { TokensCacheService } from '@/stores/TokensCacheService'

export function useRelayersEventsStore(tokensCacheService: TokensCacheService): RelayersEventsStore {
    const ref = React.useRef<RelayersEventsStore>()
    ref.current = ref.current || new RelayersEventsStore(tokensCacheService)
    return ref.current
}
