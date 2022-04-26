import * as React from 'react'

import { LiquidityRequestsStore } from '@/modules/LiquidityRequests/stores/LiquidityRequestsStore'
import { TokensAssetsService } from '@/stores/TokensAssetsService'

export function useLiquidityRequestsStore(
    tokensAssetsService: TokensAssetsService,
): LiquidityRequestsStore {
    const ref = React.useRef<LiquidityRequestsStore>()
    ref.current = ref.current || new LiquidityRequestsStore(tokensAssetsService)
    return ref.current
}
