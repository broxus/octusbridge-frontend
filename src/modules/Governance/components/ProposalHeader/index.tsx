import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import { Duration } from 'luxon'

import { Header } from '@/components/common/Section'
import { UserCard } from '@/components/common/UserCard'
import { ProposalStatus } from '@/modules/Governance/components/ProposalStatus'
import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalHeaderInner(): JSX.Element | null {
    const intl = useIntl()
    const proposal = useProposalContext()

    const duration = proposal.endTime
        ? (proposal.endTime * 1000) - new Date().getTime()
        : 0
    const { days, hours, minutes } = Duration.fromMillis(duration)
        .shiftTo('days', 'hours', 'minutes', 'seconds')

    let timeIntlId
    if (days > 0) {
        timeIntlId = 'PROPOSAL_HEAD_TIME_DAYS'
    }
    else if (hours > 0) {
        timeIntlId = 'PROPOSAL_HEAD_TIME_HOURS'
    }
    else if (minutes > 0) {
        timeIntlId = 'PROPOSAL_HEAD_TIME_MINS'
    }

    return (
        <Header size="lg">
            <div className="proposal-header">
                <h2 className="proposal-header__title">
                    {proposal.id && (
                        <span className="proposal-header__id">
                            {intl.formatMessage({
                                id: 'PROPOSAL_HEAD_ID',
                            }, {
                                id: proposal.id,
                            })}
                        </span>
                    )}

                    {proposal.title || intl.formatMessage({
                        id: 'PROPOSAL_UNKNOWN_TITLE',
                    })}
                </h2>

                <div className="proposal-header__info">
                    {proposal.state && (
                        <ProposalStatus state={proposal.state} />
                    )}

                    {timeIntlId && (
                        intl.formatMessage({
                            id: timeIntlId,
                        }, {
                            days,
                            hours,
                            minutes,
                        })
                    )}
                </div>
            </div>

            {proposal.proposer && (
                <UserCard
                    copy
                    external
                    address={proposal.proposer}
                />
            )}
        </Header>
    )
}

export const ProposalHeader = observer(ProposalHeaderInner)
