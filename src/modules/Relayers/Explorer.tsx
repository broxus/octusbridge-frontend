import * as React from 'react'
import { useIntl } from 'react-intl'

import { RoundsCalendar } from '@/modules/Relayers/components/RoundsCalendar'
import { ValidationRounds } from '@/modules/Relayers/components/ValidationRounds'
import { Events } from '@/modules/Relayers/components/Events'
import { Relayers } from '@/modules/Relayers/components/Relayers'
import { RelayersOverview } from '@/modules/Relayers/components/RelayersOverview'

export function RelayersExplorer(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <header className="page-header">
                <h1 className="page-title">
                    {intl.formatMessage({
                        id: 'RELAYERS_EXPLORER_TITLE',
                    })}
                </h1>
            </header>

            <RelayersOverview />
            <Relayers />
            <ValidationRounds />
            <RoundsCalendar />
            <Events />
        </div>
    )
}
