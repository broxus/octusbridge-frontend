import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import { Duration } from 'luxon'

import { Summary } from '@/components/common/Summary'
import { useProposalContext } from '@/modules/Governance/providers'

export function ProposalConfigInner(): JSX.Element | null {
    const proposal = useProposalContext()
    const intl = useIntl()
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const getValue = (millis: number) => {
        const { hours, minutes } = Duration.fromMillis(millis).shiftTo('hours', 'minutes', 'seconds')
        let id

        if (hours > 0 && minutes > 0) {
            id = 'PROPOSAL_CONTENT_PERIOD_FULL'
        }
        else if (minutes > 0) {
            id = 'PROPOSAL_CONTENT_PERIOD_MINS'
        }
        else {
            id = 'PROPOSAL_CONTENT_PERIOD_HOURS'
        }

        return intl.formatMessage({ id }, { hours, minutes })
    }

    return (
        <>
            <div className="proposal-content__title">
                {intl.formatMessage({
                    id: 'PROPOSAL_CONTENT_PERIODS',
                })}
            </div>
            <Summary
                compact
                adaptive
                space="sm"
                items={[{
                    key: intl.formatMessage({
                        id: 'PROPOSAL_CONTENT_VOTING_DELAY',
                    }),
                    value: proposal.votingDelay ? getValue(proposal.votingDelay) : noValue,
                }, {
                    key: intl.formatMessage({
                        id: 'PROPOSAL_CONTENT_VOTING_PERIOD',
                    }),
                    value: proposal.votingPeriod ? getValue(proposal.votingPeriod) : noValue,
                }, {
                    key: intl.formatMessage({
                        id: 'PROPOSAL_CONTENT_TIME_LOCK',
                    }),
                    value: proposal.timeLock ? getValue(proposal.timeLock) : noValue,
                }, {
                    key: intl.formatMessage({
                        id: 'PROPOSAL_CONTENT_GRACE_PERIOD',
                    }),
                    value: proposal.gracePeriod ? getValue(proposal.gracePeriod) : noValue,
                }]}
            />
        </>
    )
}

export const ProposalConfig = observer(ProposalConfigInner)
