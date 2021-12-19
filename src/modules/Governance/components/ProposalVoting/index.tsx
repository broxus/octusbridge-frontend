import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Section, Title } from '@/components/common/Section'
import { VotingPanel } from '@/modules/Governance/components/VotingPanel'
import { useVotesStore } from '@/modules/Governance/hooks'
import { useProposalContext } from '@/modules/Governance/providers'
import { getVotesPercents } from '@/modules/Governance/utils'
import { error } from '@/utils'
import { useMounted } from '@/hooks'

import './index.scss'

// TODO: Vote item percent
export function ProposalVotingInner(): JSX.Element | null {
    const proposal = useProposalContext()
    const intl = useIntl()
    const mounted = useMounted()
    const forVotes = useVotesStore()
    const againstVotes = useVotesStore()
    const votesPercents = proposal.forVotes && proposal.againstVotes
        ? getVotesPercents(proposal.forVotes, proposal.againstVotes)
        : undefined

    const fetch = async () => {
        try {
            await Promise.all([
                forVotes.fetch({
                    limit: 3,
                    offset: 0,
                    proposalId: proposal.id,
                    support: true,
                    ordering: {
                        column: 'createdAt',
                        direction: 'DESC',
                    },
                }),
                againstVotes.fetch({
                    limit: 3,
                    offset: 0,
                    proposalId: proposal.id,
                    support: false,
                    ordering: {
                        column: 'createdAt',
                        direction: 'DESC',
                    },
                }),
            ])
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        if (proposal.id) {
            fetch()
        }
    }, [proposal.id])

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
                    loading={forVotes.loading || !mounted}
                    total={proposal.quorumVotes}
                    value={proposal.forVotes}
                    percent={votesPercents && votesPercents[0]}
                    votes={forVotes.items.map(item => ({
                        address: item.voter,
                        value: item.votes,
                    }))}
                />

                <VotingPanel
                    type={0}
                    loading={againstVotes.loading || !mounted}
                    value={proposal.againstVotes}
                    percent={votesPercents && votesPercents[1]}
                    votes={againstVotes.items.map(item => ({
                        address: item.voter,
                        value: item.votes,
                    }))}
                />
            </div>
        </Section>
    )
}

export const ProposalVoting = observer(ProposalVotingInner)
