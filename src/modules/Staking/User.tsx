import * as React from 'react'

import { UserStats } from '@/modules/Staking/components/UserStats'
import { Transactions } from '@/modules/Staking/components/Transactions'

export function User(): JSX.Element {
    return (
        <div className="container container--large">
            <UserStats />
            <Transactions />
        </div>
    )
}
