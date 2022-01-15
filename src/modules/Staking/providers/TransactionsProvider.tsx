import * as React from 'react'

import { TransactionsStore } from '@/modules/Staking/stores'
import { useTransactionsStore } from '@/modules/Staking/hooks'

export const TransactionsContext = React.createContext<TransactionsStore | undefined>(undefined)

export function useTransactionsContext(): TransactionsStore {
    const transactionsContext = React.useContext(TransactionsContext)

    if (!transactionsContext) {
        throw new Error('TransactionsContext must be defined')
    }

    return transactionsContext
}

type Props = {
    children: React.ReactNode;
}

export function TransactionsProvider({
    children,
}: Props): JSX.Element | null {
    const transactions = useTransactionsStore()

    return (
        <TransactionsContext.Provider value={transactions}>
            {children}
        </TransactionsContext.Provider>
    )
}
