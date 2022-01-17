import * as React from 'react'

import { useChartStore, useMainInfoStore } from '@/modules/Staking/hooks'
import { ChartStore, MainInfoStore } from '@/modules/Staking/stores'

type Explorer = {
    mainInfo: MainInfoStore;
    chart: ChartStore;
}

export const ExplorerContext = React.createContext<Explorer | undefined>(undefined)

export function useExplorerContext(): Explorer {
    const explorerContext = React.useContext(ExplorerContext)

    if (!explorerContext) {
        throw new Error('ExplorerContext must be defined')
    }

    return explorerContext
}

type Props = {
    children: React.ReactNode;
}

export function ExplorerProvider({
    children,
}: Props): JSX.Element {
    const mainInfo = useMainInfoStore()
    const chart = useChartStore()

    return (
        <ExplorerContext.Provider
            value={{
                mainInfo,
                chart,
            }}
        >
            {children}
        </ExplorerContext.Provider>
    )
}
