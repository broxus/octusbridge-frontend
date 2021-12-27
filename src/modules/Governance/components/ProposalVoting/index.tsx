import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Section, Title } from '@/components/common/Section'
import { VotingPanel } from '@/modules/Governance/components/VotingPanel'
import { useProposalContext } from '@/modules/Governance/providers'
import { getVotesPercents } from '@/modules/Governance/utils'
import { useMounted } from '@/hooks'

import './index.scss'

// TODO: Vote item percent
export function ProposalVotingInner(): JSX.Element | null {
    const proposal = useProposalContext()
    const intl = useIntl()
    const mounted = useMounted()
    const votesPercents = proposal.forVotes && proposal.againstVotes
        ? getVotesPercents(proposal.forVotes, proposal.againstVotes)
        : undefined

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'PROPOSAL_VOTING_TITLE',
                })}
            </Title>

            <div className="proposal-voting">
                <VotingPanel
                    type={1}
                    loading={proposal.forVotesPreview.loading || !mounted}
                    total={proposal.quorumVotes}
                    value={proposal.forVotes}
                    percent={votesPercents && votesPercents[0]}
                    votes={proposal.forVotesPreview.items.map(item => ({
                        address: item.voter,
                        value: item.votes,
                    }))}
                />

                <VotingPanel
                    type={0}
                    loading={proposal.againstVotesPreview.loading || !mounted}
                    value={proposal.againstVotes}
                    percent={votesPercents && votesPercents[1]}
                    votes={proposal.againstVotesPreview.items.map(item => ({
                        address: item.voter,
                        value: item.votes,
                    }))}
                />
            </div>
        </Section>
    )
}

export const ProposalVoting = observer(ProposalVotingInner)
