import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Container } from '@/components/common/Section'
import { Relayers } from '@/modules/Relayers/components/Relayers'
import { BiddingRoundHeader } from '@/modules/Relayers/components/RoundHeader'
import { RoundsCalendar } from '@/modules/Relayers/components/RoundsCalendar'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { RoundInformation } from '@/modules/Relayers/components/RoundInformation'
import {
    RelayersProvider, RoundsCalendarProvider, useBiddingRoundContext,
    useRelayRoundInfoContext, useRoundInfoContext,
} from '@/modules/Relayers/providers'
import { useUserDataStore } from '@/modules/Relayers/hooks'

type Params = {
    num: string;
}

export function BiddingRoundInner(): JSX.Element {
    const intl = useIntl()
    const params = useParams<Params>()
    const roundInfo = useRoundInfoContext()
    const biddingRound = useBiddingRoundContext()
    const relayRoundInfo = useRelayRoundInfoContext()
    const userDataStore = useUserDataStore()
    const roundNum = parseInt(params.num, 10)

    React.useEffect(() => {
        if (roundNum) {
            biddingRound.fetch(roundNum)
            roundInfo.fetch({
                roundNum,
            })
        }
    }, [roundNum])

    React.useEffect(() => {
        if (userDataStore.isConnected) {
            userDataStore.fetch()
        }
    }, [userDataStore.isConnected])

    React.useEffect(() => {
        if (roundNum && userDataStore.isRelay && userDataStore.address) {
            relayRoundInfo.fetch({
                roundNum,
                relayAddress: userDataStore.address,
            })
        }
    }, [roundNum, userDataStore.address, userDataStore.isRelay])

    return (
        <Container size="lg">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: intl.formatMessage({
                            id: 'RELAYERS_BREADCRUMB_BIDDING',
                        }, {
                            name: params.num,
                        }),
                    }),
                }]}
            />

            <BiddingRoundHeader />

            <RoundInformation
                roundInfo={roundInfo.info}
                relayConfig={biddingRound.relayConfig}
                relayRoundInfo={relayRoundInfo.info}
            />

            <RoundsCalendarProvider>
                <RoundsCalendar
                    roundNum={parseInt(params.num, 10) - 1}
                />
            </RoundsCalendarProvider>

            <RelayersProvider>
                <Relayers
                    roundNum={parseInt(params.num, 10)}
                    roundInterval="bidding"
                />
            </RelayersProvider>
        </Container>
    )
}

export const BiddingRound = observer(BiddingRoundInner)
