import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Container } from '@/components/common/Section'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { useTextParam } from '@/hooks'
import { TransfersStats } from '@/modules/Transfers/components/Stats'
import { TransfersList } from '@/modules/Transfers/components/Transfers'
import { TransfersProvider } from '@/modules/Transfers/providers'
import { sliceAddress } from '@/utils'

function TransfersInner(): JSX.Element {
    const intl = useIntl()
    const [userAddress] = useTextParam('user')

    return (
        <Container size="lg">
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'TRANSFERS_BREADCRUMB_BRIDGE',
                    }),
                    link: '/bridge',
                }, {
                    title: intl.formatMessage({
                        id: 'TRANSFERS_BREADCRUMB_ADDRESS',
                    }, {
                        address: sliceAddress(userAddress),
                    }),
                }]}
            />

            <TransfersStats />

            <TransfersProvider>
                <TransfersList />
            </TransfersProvider>
        </Container>
    )
}

export const Transfers = observer(TransfersInner)
