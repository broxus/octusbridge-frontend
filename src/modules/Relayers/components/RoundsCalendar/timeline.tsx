import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { Day } from '@/modules/Relayers/components/RoundsCalendar/day'
import { useRoundsCalendarContext } from '@/modules/Relayers/providers'
import { DAY_MS } from '@/modules/Relayers/constants'

import './index.scss'

export function TimelineInner(): JSX.Element | null {
    const roundsCalendar = useRoundsCalendarContext()
    const { rounds } = roundsCalendar

    if (!rounds || !rounds.length) {
        return null
    }

    const startDate = new Date(rounds[0].startTime)
    const endDate = new Date(rounds[0].endTime)

    const startTime = (startDate.getHours() > 12
        ? startDate.setHours(24, 0, 0, 0)
        : startDate.setHours(0, 0, 0, 0))
        - (DAY_MS * 2)

    const endTime = (endDate.getHours() > 12
        ? endDate.setHours(24, 0, 0, 0)
        : endDate.setHours(0, 0, 0, 0))
        + (DAY_MS * 2)

    const totalDays = Math.ceil((endTime - startTime) / DAY_MS)

    const dates = []

    for (let i = 0; i < totalDays; i++) {
        dates.push(startTime + (DAY_MS * i))
    }

    return (
        <div className="rounds-calendar__line">
            {dates.map(date => (
                <Day
                    key={date}
                    totalDays={totalDays}
                    date={date}
                />
            ))}
        </div>
    )
}

export const Timeline = observer(TimelineInner)
