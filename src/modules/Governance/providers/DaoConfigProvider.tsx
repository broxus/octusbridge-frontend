import * as React from 'react'

import { useDaoConfig } from '@/modules/Governance/hooks'
import { DaoConfigStore } from '@/modules/Governance/stores'
import { useEverWallet } from '@/stores/EverWalletService'

export const DaoConfigContext = React.createContext<DaoConfigStore | undefined>(undefined)
DaoConfigContext.displayName = 'DaoConfig'

export function useDaoConfigContext(): DaoConfigStore {
    const ctx = React.useContext(DaoConfigContext)

    if (!ctx) {
        throw new Error('DaoConfig context must be defined')
    }

    return ctx
}

type Props = {
    children: React.ReactNode;
}

export function DaoConfigProvider({
    children,
}: Props): JSX.Element | null {
    const wallet = useEverWallet()
    const daoConfig = useDaoConfig(wallet)

    React.useEffect(() => {
        daoConfig.init()

        return () => {
            daoConfig.dispose()
        }
    }, [])

    return (
        <DaoConfigContext.Provider value={daoConfig}>
            {children}
        </DaoConfigContext.Provider>
    )
}
