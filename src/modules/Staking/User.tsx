import * as React from 'react'
import { useIntl } from 'react-intl'

import { Container } from '@/components/common/Section'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { UserStats } from '@/modules/Staking/components/UserStats'
import { Transactions } from '@/modules/Staking/components/Transactions'
import { sliceAddress } from '@/utils'

type Props = {
    userAddress: string;
}

export function User({
    userAddress,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Container size="lg">
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_ROOT',
                    }),
                    link: '/staking',
                }, {
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_USER',
                    }, {
                        address: sliceAddress(userAddress),
                    }),
                }]}
            />

            <UserStats
                userAddress={userAddress}
            />

            <Transactions
                userAddress={userAddress}
            />
        </Container>
    )
}
