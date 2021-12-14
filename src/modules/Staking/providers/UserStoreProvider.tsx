import * as React from 'react'

import { UserStore } from '@/modules/Staking/stores/User'
import { useUser } from '@/modules/Staking/hooks/useUser'

type Props = {
    children: React.ReactNode;
}

export const UserStoreContext = React.createContext<UserStore | undefined>(undefined)

export function UserStoreProvider({
    children,
}: Props): JSX.Element | null {
    const user = useUser()

    return (
        <UserStoreContext.Provider value={user}>
            {children}
        </UserStoreContext.Provider>
    )
}
