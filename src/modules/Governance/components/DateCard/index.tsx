import * as React from 'react'
import { Duration } from 'luxon'
import { useIntl } from 'react-intl'

import { dateFormat } from '@/utils'

import './index.scss'

type Props = {
    timestamp: number;
}

export function DateCard({
    timestamp,
}: Props): JSX.Element {
    const intl = useIntl()
    const duration = timestamp - new Date().getTime()
    const { days, hours, minutes } = Duration.fromMillis(duration)
        .shiftTo('days', 'hours', 'minutes', 'seconds')

    let intlId
    if (days > 0) {
        intlId = 'PROPOSAL_ACTION_DAYS'
    }
    else if (hours > 0) {
        intlId = 'PROPOSAL_ACTION_HOURS'
    }
    else if (minutes > 0) {
        intlId = 'PROPOSAL_ACTION_MINUTES'
    }
    else {
        intlId = 'PROPOSAL_ACTION_EXPIRED'
    }

    return (
        <div className="proposal-date-card">
            <div className="proposal-date-card__label">
                {intl.formatMessage({
                    id: intlId,
                }, {
                    days,
                    hours,
                    minutes,
                })}
            </div>
            <div className="proposal-date-card__value">
                {dateFormat(timestamp)}
            </div>
        </div>
    )
}
