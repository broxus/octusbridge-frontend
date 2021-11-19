import * as React from 'react'

import { Relayers } from '@/modules/Relayers/components/Relayers'
import { EventInformation } from '@/modules/Relayers/components/EventInformation'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { EventHeader } from '@/modules/Relayers/components/EventHeader'

export function Event(): JSX.Element {
    return (
        <div className="container container--large">
            <ExplorerBreadcrumb
                items={[{
                    title: 'Transfer e65e64e6r4...r4e3646',
                }]}
            />

            <EventHeader />

            <EventInformation />

            <Relayers />
        </div>
    )
}
