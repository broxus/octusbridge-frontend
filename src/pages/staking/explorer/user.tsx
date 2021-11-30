import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import { User } from '@/modules/Staking/User'
import { UserStoreProvider } from '@/modules/Staking/providers/UserStoreProvider'

type Params = {
    userAddress: string;
}

export default function Page(): JSX.Element {
    const intl = useIntl()
    const { userAddress } = useParams<Params>()

    return (
        <div className="container container--large">
            <UserStoreProvider>
                <User
                    userAddress={userAddress}
                    title={intl.formatMessage({
                        id: 'STAKING_USER_STATS_USER',
                    })}
                />
            </UserStoreProvider>
        </div>
    )
}
