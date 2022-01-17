import * as React from 'react'

import { StakeholdersStore } from '@/modules/Staking/stores'
import { useStakeholdersStore } from '@/modules/Staking/hooks'

export const StakeholdersContext = React.createContext<StakeholdersStore | undefined>(undefined)

export function useStakeholdersContext(): StakeholdersStore {
    const stakeholdersContext = React.useContext(StakeholdersContext)

    if (!stakeholdersContext) {
        throw new Error('StakeholdersContext must be defined')
    }

    return stakeholdersContext
}

type Props = {
    children: React.ReactNode;
}

export function StakeholdersProvider({
    children,
}: Props): JSX.Element | null {
    const stakeholders = useStakeholdersStore()

    return (
        <StakeholdersContext.Provider value={stakeholders}>
            {children}
        </StakeholdersContext.Provider>
    )
}
