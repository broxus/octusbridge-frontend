import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { Timeline } from '@/modules/Governance/components/ProposalTimeline/Timeline'
import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalTimeline(): JSX.Element | null {
    const intl = useIntl()
    const proposal = useProposalContext()

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'PROPOSAL_TIMELINE_TITLE',
                })}
            </Title>

            {proposal.createdAt
            && proposal.startTime
            && proposal.queuedAt
            && proposal.executedAt
            && proposal.gracePeriod
                ? (
                    <Timeline
                        createdAt={proposal.createdAt}
                        executedAt={proposal.executedAt}
                        gracePeriod={proposal.gracePeriod}
                        queuedAt={proposal.queuedAt}
                        startTime={proposal.startTime}
                    />
                ) : (
                    <div className="card card--flat card--small proposal-timeline-empty">
                        {intl.formatMessage({
                            id: 'PROPOSAL_NO_TIMELINE',
                        })}
                    </div>
                )}
        </Section>
    )
}
