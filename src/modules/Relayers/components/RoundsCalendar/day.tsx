import * as React from 'react'
import classNames from 'classnames'
import { DateTime } from 'luxon'

import './index.scss'

type Props = {
    date: number;
    disabled?: boolean;
    totalDays: number;
    length?: number;
}

export function Day({
    date,
    disabled,
    totalDays,
    length = 1,
}: Props): JSX.Element {
    const width = (100 / totalDays) * length
    const now = Date.now()
    const active = now > date && now < new Date(date).setHours(24, 0, 0, 0)

    return (
        <div
            className={classNames('rounds-calendar-day', {
                'rounds-calendar-day_disabled': disabled,
                'rounds-calendar-day_active': active,
            })}
            style={{
                width: `${width}%`,
            }}
        >
            <span>
                <span className="rounds-calendar-day__week-full">
                    {DateTime.fromMillis(date).toFormat('ccc')}
                </span>
                <span className="rounds-calendar-day__week-short">
                    {DateTime.fromMillis(date).toFormat('ccc')[0]}
                </span>
            </span>
            <span className="rounds-calendar-day__date">
                <span className="rounds-calendar-day__day">
                    {DateTime.fromMillis(date).toFormat('dd')}
                </span>
                <span className="rounds-calendar-day__month">
                    .
                    {DateTime.fromMillis(date).toFormat('LL')}
                </span>
            </span>
        </div>
    )
}
