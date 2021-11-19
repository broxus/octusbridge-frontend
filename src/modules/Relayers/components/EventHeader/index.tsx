import * as React from 'react'

import { EventCard } from '@/modules/Relayers/components/EventCard'
import { ExternalLink, HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'

import './index.scss'

export function EventHeader(): JSX.Element {
    return (
        <HeaderLayout>
            <EventCard />
            <ExternalLink link="/" />
        </HeaderLayout>
    )
}
