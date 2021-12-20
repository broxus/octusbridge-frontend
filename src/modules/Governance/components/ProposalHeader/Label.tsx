import * as React from 'react'
import { useIntl } from 'react-intl'
import { Duration } from 'luxon'

import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function Label(): JSX.Element | null {
    const intl = useIntl()
    const proposal = useProposalContext()

    if (!proposal.endTime || !proposal.startTime) {
        return null
    }

    if (proposal.state === 'Canceled' || proposal.state === 'Failed') {
        return null
    }

    const currentTime = new Date().getTime()

    if (currentTime < proposal.startTime) {
        const duration = proposal.startTime - currentTime
        const { days, hours, minutes } = Duration.fromMillis(duration)
            .shiftTo('days', 'hours', 'minutes', 'seconds')

        let id
        if (days > 0) {
            id = 'PROPOSAL_HEAD_START_DAYS'
        }
        else if (hours > 0) {
            id = 'PROPOSAL_HEAD_START_HOURS'
        }
        else {
            id = 'PROPOSAL_HEAD_START_MINUTES'
        }

        return (
            <span>
                {intl.formatMessage({
                    id,
                }, {
                    days, hours, minutes,
                })}
            </span>
        )
    }

    if (currentTime >= proposal.startTime && currentTime < proposal.endTime) {
        const duration = proposal.endTime - currentTime
        const { days, hours, minutes } = Duration.fromMillis(duration)
            .shiftTo('days', 'hours', 'minutes', 'seconds')

        let id
        if (days > 0) {
            id = 'PROPOSAL_HEAD_END_DAYS'
        }
        else if (hours > 0) {
            id = 'PROPOSAL_HEAD_END_HOURS'
        }
        else {
            id = 'PROPOSAL_HEAD_END_MINUTES'
        }

        return (
            <span>
                {intl.formatMessage({
                    id,
                }, {
                    days, hours, minutes,
                })}
            </span>
        )
    }

    if (proposal.state === 'Queued' && proposal.executedAt && currentTime < proposal.executedAt) {
        const duration = proposal.executedAt - currentTime

        const { days, hours, minutes } = Duration.fromMillis(duration)
            .shiftTo('days', 'hours', 'minutes', 'seconds')

        let id
        if (days > 0) {
            id = 'PROPOSAL_HEAD_EXECUTION_DAYS'
        }
        else if (hours > 0) {
            id = 'PROPOSAL_HEAD_EXECUTION_HOURS'
        }
        else {
            id = 'PROPOSAL_HEAD_EXECUTION_MINUTES'
        }

        return (
            <span>
                {intl.formatMessage({
                    id,
                }, {
                    days, hours, minutes,
                })}
            </span>
        )
    }

    return null
}
