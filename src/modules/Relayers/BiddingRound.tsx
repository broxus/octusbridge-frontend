import * as React from 'react'
import { useIntl } from 'react-intl'

import { Relayers } from '@/modules/Relayers/components/Relayers'
import { RoundHeader } from '@/modules/Relayers/components/RoundHeader'
import { RoundsCalendar } from '@/modules/Relayers/components/RoundsCalendar'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { RoundInformation } from '@/modules/Relayers/components/RoundInformation'

export function BiddingRound(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: intl.formatMessage({
                            id: 'RELAYERS_BREADCRUMB_BIDDING',
                        }, {
                            name: '123',
                        }),
                    }),
                }]}
            />

            <RoundHeader
                title="Bidding round 124"
                type="bidding"
            />

            <RoundInformation />
            <RoundsCalendar />
            <Relayers />
        </div>
    )
}
