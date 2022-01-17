import * as React from 'react'

import { TransfersStore } from '@/modules/Transfers/stores'
import { useTransfers } from '@/modules/Transfers/hooks'

type Transfers = TransfersStore

export const TransfersContext = React.createContext<Transfers | undefined>(undefined)

export function useTransfersContext(): Transfers {
    const transfersContext = React.useContext(TransfersContext)

    if (!transfersContext) {
        throw new Error('TransfersContext must be defined')
    }

    return transfersContext
}

type Props = {
    children: React.ReactNode;
}

export function TransfersProvider({
    children,
}: Props): JSX.Element | null {
    const transfers = useTransfers()

    return (
        <TransfersContext.Provider value={transfers}>
            {children}
        </TransfersContext.Provider>
    )
}
