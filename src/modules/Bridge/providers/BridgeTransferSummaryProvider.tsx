import * as React from 'react'

import { TransferSummary } from '@/modules/Bridge/stores/TransferSummary'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'


export const BridgeTransferSummeryContext = React.createContext<TransferSummary>(new TransferSummary(useBridgeAssets()))

export function useSummary(): TransferSummary {
    return React.useContext(BridgeTransferSummeryContext)
}

export function BridgeTransferSummeryProvider({ children }: React.PropsWithChildren): JSX.Element {
    const context = React.useRef(new TransferSummary(useBridgeAssets()))

    React.useEffect(() => {
        context.current = new TransferSummary(useBridgeAssets())
        return () => context.current.reset()
    }, [])

    return (
        <BridgeTransferSummeryContext.Provider value={context.current}>
            {children}
        </BridgeTransferSummeryContext.Provider>
    )
}
