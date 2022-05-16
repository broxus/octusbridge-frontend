import * as React from 'react'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'

import { useRoundsCalendarContext } from '@/modules/Relayers/providers'
import { DAY_MS } from '@/modules/Relayers/constants'

import './index.scss'

type Item = {
    startTime: number;
    endTime: number;
    content: React.ReactNode | React.ReactNodeArray;
}

type Props = {
    className?: string;
    items: Item[];
}

export function ScaleInner({
    className,
    items,
}: Props): JSX.Element | null {
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

    const width = endTime - startTime

    return (
        <div
            className={classNames('rounds-calendar-scale', className)}
        >
            {items.map((item, index) => (
                <div
                    /* eslint-disable react/no-array-index-key */
                    key={index}
                    className="rounds-calendar-scale__section"
                    style={{
                        left: `${((item.startTime - startTime) * 100) / width}%`,
                        width: `${((item.endTime - item.startTime) * 100) / width}%`,
                    }}
                >
                    {item.content}
                </div>
            ))}
        </div>
    )
}

export const Scale = observer(ScaleInner)
