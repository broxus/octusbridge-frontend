import * as React from 'react'

import { useUserDataStore } from '@/modules/Relayers/hooks'
import { UserDataStore } from '@/modules/Relayers/store'

export const UserDataContext = React.createContext<UserDataStore | undefined>(undefined)

export function useUserDataContext(): UserDataStore {
    const userDataContext = React.useContext(UserDataContext)

    if (!userDataContext) {
        throw new Error('UserDataContext must be defined')
    }

    return userDataContext
}

type Props = {
    children: React.ReactNode;
}

export function UserDataProvider({
    children,
}: Props): JSX.Element {
    const userData = useUserDataStore()

    return (
        <UserDataContext.Provider value={userData}>
            {children}
        </UserDataContext.Provider>
    )
}
