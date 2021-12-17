import * as React from 'react'
import { useIntl } from 'react-intl'
import { Duration } from 'luxon'
import { observer } from 'mobx-react-lite'

import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalDatesInner(): JSX.Element | null {
    const intl = useIntl()
    const currentTime = new Date().getTime()
    const proposal = useProposalContext()

    if (!proposal.startTime || !proposal.endTime) {
        return null
    }

    let duration

    if (currentTime < proposal.startTime) {
        duration = proposal.startTime - currentTime
    }
    if (currentTime > proposal.endTime * 1000) {
        duration = currentTime - (proposal.endTime * 1000)
    }

    if (!duration) {
        return null
    }

    let intlId = 'PROPOSAL_DATES_NOW'

    const { hours, minutes } = Duration.fromMillis(duration)
        .shiftTo('hours', 'minutes', 'seconds')

    if (currentTime < proposal.startTime) {
        if (hours > 0) {
            intlId = 'PROPOSAL_DATES_START_HOURS'
        }
        else if (minutes > 0) {
            intlId = 'PROPOSAL_DATES_START_MINS'
        }
    }
    if (currentTime > proposal.endTime * 1000) {
        if (hours > 0) {
            intlId = 'PROPOSAL_DATES_END_HOURS'
        }
        else if (minutes > 0) {
            intlId = 'PROPOSAL_DATES_END_MINS'
        }
    }

    return (
        <div className="user-vote__message text-muted">
            {intl.formatMessage({
                id: intlId,
            }, {
                hours,
                minutes,
            })}
        </div>
    )
}

export const ProposalDates = observer(ProposalDatesInner)
