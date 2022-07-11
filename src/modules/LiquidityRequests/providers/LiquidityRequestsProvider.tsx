import * as React from 'react'

import { LiquidityRequestsStore } from '@/modules/LiquidityRequests/stores/LiquidityRequestsStore'
import { useLiquidityRequestsStore } from '@/modules/LiquidityRequests/hooks/useLiquidityRequestsStore'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'

type Props = {
    children: React.ReactNode;
}

export const LiquidityRequestsContext = React.createContext<LiquidityRequestsStore | undefined>(undefined)

export function LiquidityRequestsProvider({
    children,
}: Props): JSX.Element | null {
    const bridgeAssets = useBridgeAssets()
    const liquidityRequests = useLiquidityRequestsStore(bridgeAssets)

    return (
        <LiquidityRequestsContext.Provider value={liquidityRequests}>
            {children}
        </LiquidityRequestsContext.Provider>
    )
}

export function useLiquidityRequests(): LiquidityRequestsStore {
    const liquidityRequestsContext = React.useContext(LiquidityRequestsContext)

    if (!liquidityRequestsContext) {
        throw new Error('LiquidityRequestsContext must be defined')
    }

    return liquidityRequestsContext
}
