import * as React from 'react'

import { ExplorerStore } from '@/modules/Staking/stores/Explorer'
import { useExplorer } from '@/modules/Staking/hooks/useExplorer'

type Props = {
    children: React.ReactNode;
}

export const ExplorerStoreContext = React.createContext<ExplorerStore | undefined>(undefined)

export function ExplorerStoreProvider({
    children,
}: Props): JSX.Element | null {
    const explorer = useExplorer()

    return (
        <ExplorerStoreContext.Provider value={explorer}>
            {children}
        </ExplorerStoreContext.Provider>
    )
}
