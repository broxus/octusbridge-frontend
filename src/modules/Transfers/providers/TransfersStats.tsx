import * as React from 'react'

import { TransfersChartStore, TransfersStatsStore } from '@/modules/Transfers/stores'
import { useTransfersChart, useTransfersStats } from '@/modules/Transfers/hooks'

type TransfersStats = {
    stats: TransfersStatsStore;
    chart: TransfersChartStore;
}

export const TransfersStatsContext = React.createContext<TransfersStats | undefined>(undefined)

export function useTransfersStatsContext(): TransfersStats {
    const transfersStatsContext = React.useContext(TransfersStatsContext)

    if (!transfersStatsContext) {
        throw new Error('TransfersStatsContext must be defined')
    }

    return transfersStatsContext
}

type Props = {
    children: React.ReactNode;
}

export function TransfersStatsProvider({
    children,
}: Props): JSX.Element | null {
    const stats = useTransfersStats()
    const chart = useTransfersChart()

    return (
        <TransfersStatsContext.Provider value={{ stats, chart }}>
            {children}
        </TransfersStatsContext.Provider>
    )
}
