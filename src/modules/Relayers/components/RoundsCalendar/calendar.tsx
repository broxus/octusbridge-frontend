import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { Line } from '@/components/common/Section'
import { ValidationRounds } from '@/modules/Relayers/components/RoundsCalendar/validationRounds'
import { ValidationBlocks } from '@/modules/Relayers/components/RoundsCalendar/validationBlocks'
import { BiddingRounds } from '@/modules/Relayers/components/RoundsCalendar/biddingRounds'
import { BiddingBlocks } from '@/modules/Relayers/components/RoundsCalendar/biddingBlocks'
import { Timeline } from '@/modules/Relayers/components/RoundsCalendar/timeline'
import { Cursor } from '@/modules/Relayers/components/RoundsCalendar/cursor'
import { useRoundsCalendarContext } from '@/modules/Relayers/providers'

import './index.scss'

export function CalendarInner(): JSX.Element | null {
    const roundsCalendar = useRoundsCalendarContext()
    const { rounds } = roundsCalendar

    if (!rounds || !rounds.length) {
        return null
    }

    return (
        <div className="rounds-calendar__inner">
            <Timeline />
            <Line />
            <ValidationRounds />
            <ValidationBlocks className="rounds-calendar__validations" />
            <BiddingRounds />
            <BiddingBlocks />
            <Cursor />
        </div>
    )
}

export const Calendar = observer(CalendarInner)
