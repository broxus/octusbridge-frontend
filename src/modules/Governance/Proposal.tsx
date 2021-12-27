import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Container } from '@/components/common/Section'
import { ProposalHeader } from '@/modules/Governance/components/ProposalHeader'
import { ProposalBreadcrumb } from '@/modules/Governance/components/ProposalBreadcrumb'
import { ProposalVoting } from '@/modules/Governance/components/ProposalVoting'
import { ProposalContent } from '@/modules/Governance/components/ProposalContent'
import { VotesTable } from '@/modules/Governance/VotesTable'
import { ProposalTimeline } from '@/modules/Governance/components/ProposalTimeline'
import { ProposalManagement } from '@/modules/Governance/components/ProposalManagement'
import { UserVote } from '@/modules/Governance/components/UserVote'
import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalInner(): JSX.Element | null {
    const proposal = useProposalContext()

    if (proposal.loading) {
        return (
            <ContentLoader transparent />
        )
    }

    return (
        <Container size="lg">
            <ProposalBreadcrumb />
            <ProposalHeader />

            <div className="proposal-layout-content">
                <div>
                    <ProposalVoting />
                    <ProposalTimeline />
                    <ProposalContent />
                </div>
                <div className="proposal-layout-sidebar">
                    <ProposalManagement />
                    <UserVote />
                </div>
            </div>

            <VotesTable proposalId={proposal.id} />
        </Container>
    )
}

export const Proposal = observer(ProposalInner)
