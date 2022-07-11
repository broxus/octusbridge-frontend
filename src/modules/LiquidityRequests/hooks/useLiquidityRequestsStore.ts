import * as React from 'react'

import { LiquidityRequestsStore } from '@/modules/LiquidityRequests/stores/LiquidityRequestsStore'
import { BridgeAssetsService } from '@/stores/BridgeAssetsService'

export function useLiquidityRequestsStore(bridgeAssets: BridgeAssetsService): LiquidityRequestsStore {
    const ref = React.useRef<LiquidityRequestsStore>()
    ref.current = ref.current || new LiquidityRequestsStore(bridgeAssets)
    return ref.current
}
