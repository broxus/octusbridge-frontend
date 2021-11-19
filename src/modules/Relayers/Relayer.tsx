import * as React from 'react'
import { useIntl } from 'react-intl'

import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { RelayerHeader } from '@/modules/Relayers/components/RelayerHeader'
import { RelayerMessage } from '@/modules/Relayers/components/RelayerMessage'
import { RelayerPerformance } from '@/modules/Relayers/components/RelayerPerformance'
import { ValidationRounds } from '@/modules/Relayers/components/ValidationRounds'
import { RoundsCalendar } from '@/modules/Relayers/components/RoundsCalendar'
import { Events } from '@/modules/Relayers/components/Events'
import { RelayerStoreContext } from '@/modules/Relayers/providers/RelayerStoreProvider'
import { sliceAddress } from '@/utils'

export function Relayer(): JSX.Element | null {
    const intl = useIntl()
    const relayer = React.useContext(RelayerStoreContext)

    if (!relayer || !relayer.address) {
        return null
    }

    return (
        <div className="container container--large">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'RELAYERS_BREADCRUMB_RELAYERS',
                    }, {
                        address: sliceAddress(relayer.address),
                    }),
                }]}
            />

            <RelayerHeader />
            <RelayerMessage />
            <RelayerPerformance />
            <ValidationRounds />
            <RoundsCalendar />
            <Events />
        </div>
    )
}
