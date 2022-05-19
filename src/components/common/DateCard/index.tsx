import * as React from 'react'

import { dateFormat } from '@/utils'

import './index.scss'

type Props = {
    time?: number;
}

export function DateCard({
    time,
}: Props): JSX.Element | null {
    if (!time) {
        return null
    }

    return (
        <div className="date-card">
            {dateFormat(time, 'HH:mm:ss')}

            <div className="date-card__extra">
                {dateFormat(time, 'MMM dd, yyyy')}
            </div>
        </div>
    )
}
