import * as React from 'react'
import { Duration } from 'luxon'
import { useIntl } from 'react-intl'

import { dateFormat } from '@/utils'

import './index.scss'

type Props = {
    startTime: number;
    endTime: number;
}

export function DateCard({
    startTime,
    endTime,
}: Props): JSX.Element {
    const intl = useIntl()

    let label,
        timestamp

    const currentTime = new Date().getTime()

    if (currentTime < startTime) {
        let intlId
        const duration = startTime - currentTime
        const { days, hours, minutes } = Duration.fromMillis(duration)
            .shiftTo('days', 'hours', 'minutes', 'seconds')

        if (days > 0) {
            intlId = 'PROPOSAL_DATE_START_DAYS'
        }
        else if (hours > 0) {
            intlId = 'PROPOSAL_DATE_START_HOURS'
        }
        else {
            intlId = 'PROPOSAL_DATE_START_MINUTES'
        }

        label = intl.formatMessage({
            id: intlId,
        }, {
            days, hours, minutes,
        })

        timestamp = startTime
    }
    else if (currentTime >= startTime && currentTime < endTime) {
        let intlId
        const duration = endTime - currentTime
        const { days, hours, minutes } = Duration.fromMillis(duration)
            .shiftTo('days', 'hours', 'minutes', 'seconds')

        if (days > 0) {
            intlId = 'PROPOSAL_DATE_END_DAYS'
        }
        else if (hours > 0) {
            intlId = 'PROPOSAL_DATE_END_HOURS'
        }
        else {
            intlId = 'PROPOSAL_DATE_END_MINUTES'
        }

        label = intl.formatMessage({
            id: intlId,
        }, {
            days, hours, minutes,
        })

        timestamp = endTime
    }
    else {
        label = intl.formatMessage({
            id: 'PROPOSAL_DATE_ENDED',
        })

        timestamp = endTime
    }

    return (
        <div className="proposal-date-card">
            <div className="proposal-date-card__label">
                {label}
            </div>
            <div className="proposal-date-card__value">
                {dateFormat(timestamp)}
            </div>
        </div>
    )
}
