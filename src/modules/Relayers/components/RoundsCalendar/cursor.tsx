import * as React from 'react'

import { Scale } from '@/modules/Relayers/components/RoundsCalendar/scale'

import './index.scss'

export function Cursor(): JSX.Element {
    return (
        <Scale
            className="rounds-calendar-scale_cursor-wrapper"
            items={[{
                startTime: Date.now(),
                endTime: Date.now() + 1,
                content: (
                    <div className="rounds-calendar-cursor" />
                ),
            }]}
        />
    )
}
