import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Container } from '@/components/common/Section'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { RelayerHeader } from '@/modules/Relayers/components/RelayerHeader'
import { RelayerMessage } from '@/modules/Relayers/components/RelayerMessage'
import { RelayerPerformance } from '@/modules/Relayers/components/RelayerPerformance'
import { ValidationRounds } from '@/modules/Relayers/components/ValidationRounds'
import { RoundsCalendar } from '@/modules/Relayers/components/RoundsCalendar'
import {
    AllRelayRoundsInfoProvider, RelayersEventsProvider, RoundInfoListProvider,
    RoundsCalendarProvider, useRelayInfoContext, useUserDataContext,
} from '@/modules/Relayers/providers'
import { Events } from '@/modules/Relayers/components/Events'
import { sliceAddress } from '@/utils'

type Params = {
    address: string;
}

export function RelayerInner(): JSX.Element | null {
    const intl = useIntl()
    const params = useParams<Params>()
    const relayInfo = useRelayInfoContext()
    const userData = useUserDataContext()

    React.useEffect(() => {
        if (params.address) {
            relayInfo.fetch({
                relayAddress: params.address,
            })
        }
    }, [params.address])

    React.useEffect(() => {
        if (userData.isConnected) {
            userData.fetch()
        }
        else {
            userData.dispose()
        }
    }, [userData.isConnected])

    return (
        <Container size="lg">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'RELAYERS_BREADCRUMB_RELAYERS',
                    }, {
                        address: sliceAddress(params.address),
                    }),
                }]}
            />

            <RelayerMessage />

            <RelayerHeader />

            <RelayerPerformance />

            <AllRelayRoundsInfoProvider>
                <RoundInfoListProvider
                    relayAddress={params.address}
                >
                    <ValidationRounds />
                </RoundInfoListProvider>
            </AllRelayRoundsInfoProvider>

            <RoundsCalendarProvider>
                <RoundsCalendar
                    roundNum="current"
                />
            </RoundsCalendarProvider>

            <RelayersEventsProvider>
                <Events
                    relay={params.address}
                />
            </RelayersEventsProvider>
        </Container>
    )
}

export const Relayer = observer(RelayerInner)
