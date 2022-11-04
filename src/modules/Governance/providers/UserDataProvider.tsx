import * as React from 'react'

import { UserDataStore } from '@/modules/Governance/stores'
import { useEverWallet } from '@/stores/EverWalletService'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useTokensCache } from '@/stores/TokensCacheService'

export const UserDataContext = React.createContext<UserDataStore | undefined>(undefined)
UserDataContext.displayName = 'UserData'

export function useUserDataContext(): UserDataStore {
    const userDataContext = React.useContext(UserDataContext)

    if (!userDataContext) {
        throw new Error('Voting context must be defined')
    }

    return userDataContext
}

type Props = {
    children: React.ReactNode;
}

export function UserDataProvider({
    children,
}: Props): JSX.Element | null {
    const wallet = useEverWallet()
    const tokenCache = useTokensCache()
    const userData = useUserData(wallet, tokenCache)

    React.useEffect(() => {
        userData.init()

        return () => {
            userData.dispose()
        }
    }, [])

    return (
        <UserDataContext.Provider value={userData}>
            {children}
        </UserDataContext.Provider>
    )
}
