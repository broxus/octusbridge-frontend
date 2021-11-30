import * as React from 'react'
import { useIntl } from 'react-intl'

import { Breadcrumb } from '@/components/common/Breadcrumb'
import { UserStats } from '@/modules/Staking/components/UserStats'
import { Transactions } from '@/modules/Staking/components/Transactions'
import { useScrollTop } from '@/hooks/useScrollTop'
import { sliceAddress } from '@/utils'

type Props = {
    title: string,
    userAddress: string;
}

export function User({
    title,
    userAddress,
}: Props): JSX.Element {
    const intl = useIntl()

    useScrollTop()

    return (
        <>
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_ROOT',
                    }),
                    link: '/staking',
                }, {
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_EXPLORER',
                    }),
                    link: '/staking/explorer',
                }, {
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_USER',
                    }, {
                        address: sliceAddress(userAddress),
                    }),
                }]}
            />

            <UserStats
                title={title}
                userAddress={userAddress}
            />

            <Transactions
                userAddress={userAddress}
            />
        </>
    )
}
