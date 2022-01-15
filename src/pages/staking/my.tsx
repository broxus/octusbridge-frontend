import * as React from 'react'

import { CurrentUser } from '@/modules/Staking/CurrentUser'
import { CurrentUserProvider } from '@/modules/Staking/providers/CurrentUserProvider'
import { UserProvider } from '@/modules/Staking/providers/UserProvider'
import { TransactionsProvider } from '@/modules/Staking/providers/TransactionsProvider'

export default function Page(): JSX.Element {
    return (
        <UserProvider>
            <TransactionsProvider>
                <CurrentUserProvider>
                    <CurrentUser />
                </CurrentUserProvider>
            </TransactionsProvider>
        </UserProvider>
    )
}
