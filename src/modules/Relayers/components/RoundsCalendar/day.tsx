import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    active?: boolean;
    disabled?: boolean;
    maxLength: number;
    length?: number;
}

export function Day({
    active,
    disabled,
    maxLength,
    length = 1,
}: Props): JSX.Element {
    const width = (100 / maxLength) * length

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
                Wed
            </span>
            <span className="rounds-calendar-day__date">
                1.12
            </span>

            {active && (
                <div className="rounds-calendar-day__cursor" />
            )}
        </div>
    )
}
