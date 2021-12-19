import * as React from 'react'
import classNames from 'classnames'
import { DateTime } from 'luxon'

import './index.scss'

type Props = {
    active?: boolean;
    disabled?: boolean;
    timestamp: number;
}

export function Day({
    active,
    disabled,
    timestamp,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('timeline-day', {
                'timeline-day_disabled': disabled,
                'timeline-day_active': active,
            })}
        >
            <span>
                {DateTime.fromMillis(timestamp).toFormat('ccc')}
            </span>
            <span className="timeline-day__date">
                {DateTime.fromMillis(timestamp).toFormat('d.L')}
            </span>
        </div>
    )
}
