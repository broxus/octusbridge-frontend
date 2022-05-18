import * as React from 'react'
import { useIntl } from 'react-intl'

import { Container, Header, Title } from '@/components/common/Section'
import { RoundsCalendar } from '@/modules/Relayers/components/RoundsCalendar'
import { ValidationRounds } from '@/modules/Relayers/components/ValidationRounds'
import { Events } from '@/modules/Relayers/components/Events'
import { Relayers } from '@/modules/Relayers/components/Relayers'
import { RelayersOverview } from '@/modules/Relayers/components/RelayersOverview'
import {
    RelayersEventsProvider, RelayersProvider, RelayRoundsInfoProvider,
    RoundInfoListProvider, RoundInfoProvider, RoundsCalendarProvider,
} from '@/modules/Relayers/providers'

export function RelayersExplorer(): JSX.Element {
    const intl = useIntl()

    return (
        <Container size="lg">
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'RELAYERS_EXPLORER_TITLE',
                    })}
                </Title>
            </Header>

            <RoundInfoProvider>
                <RelayersOverview />
            </RoundInfoProvider>

            <RelayersProvider>
                <Relayers />
            </RelayersProvider>

            <RoundInfoListProvider>
                <RelayRoundsInfoProvider>
                    <ValidationRounds />
                </RelayRoundsInfoProvider>
            </RoundInfoListProvider>

            <RoundsCalendarProvider>
                <RoundsCalendar
                    roundNum="current"
                />
            </RoundsCalendarProvider>

            <RelayersEventsProvider>
                <Events />
            </RelayersEventsProvider>
        </Container>
    )
}
