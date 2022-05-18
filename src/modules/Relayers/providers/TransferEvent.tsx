import * as React from 'react'

import { useTransferEventStore } from '@/modules/Relayers/hooks'
import { TransferEventStore } from '@/modules/Relayers/store'
import { useTokensCache } from '@/stores/TokensCacheService'

export const TransferEventContext = React.createContext<TransferEventStore | undefined>(undefined)

export function useTransferEventContext(): TransferEventStore {
    const transferEventContext = React.useContext(TransferEventContext)

    if (!transferEventContext) {
        throw new Error('TransferEventContext must be defined')
    }

    return transferEventContext
}

type Props = {
    children: React.ReactNode;
}

export function TransferEventProvider({
    children,
}: Props): JSX.Element {
    const tokensCache = useTokensCache()
    const transferEvent = useTransferEventStore(tokensCache)

    return (
        <TransferEventContext.Provider value={transferEvent}>
            {children}
        </TransferEventContext.Provider>
    )
}
