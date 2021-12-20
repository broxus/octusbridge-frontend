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

    if (currentTime < proposal.startTime) {
        const duration = proposal.startTime - currentTime
        const { hours, minutes } = Duration.fromMillis(duration)
            .shiftTo('hours', 'minutes', 'seconds')

        let intlId
        if (hours > 0) {
            intlId = 'PROPOSAL_DATES_START_HOURS'
        }
        else if (minutes > 0) {
            intlId = 'PROPOSAL_DATES_START_MINS'
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

    if (currentTime > proposal.endTime) {
        return (
            <div className="user-vote__message text-muted">
                {intl.formatMessage({
                    id: 'PROPOSAL_DATES_END',
                })}
            </div>
        )
    }

    return null
}

export const ProposalDates = observer(ProposalDatesInner)
