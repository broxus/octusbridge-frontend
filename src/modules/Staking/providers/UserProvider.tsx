import * as React from 'react'

import { UserInfoStore } from '@/modules/Staking/stores'
import { useUserInfoStore } from '@/modules/Staking/hooks'

type User = {
    userInfo: UserInfoStore;
}

export const UserContext = React.createContext<User | undefined>(undefined)

export function useUserContext(): User {
    const userContext = React.useContext(UserContext)

    if (!userContext) {
        throw new Error('UserContext must be defined')
    }

    return userContext
}

type Props = {
    children: React.ReactNode;
}

export function UserProvider({
    children,
}: Props): JSX.Element | null {
    const userInfo = useUserInfoStore()

    return (
        <UserContext.Provider value={{ userInfo }}>
            {children}
        </UserContext.Provider>
    )
}
