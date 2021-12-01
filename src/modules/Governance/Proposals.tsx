import * as React from 'react'
import { useIntl } from 'react-intl'

import { Container, Title } from '@/components/common/Section'
import { ProposalsTable } from '@/modules/Governance/ProposalsTable'
import { ProposalsTableUser } from '@/modules/Governance/ProposalsTableUser'
// import { UserVotes } from '@/modules/Governance/UserVotes'

import './index.scss'

export function Proposals(): JSX.Element {
    const intl = useIntl()

    return (
        <Container size="lg">
            <Title size="lg">
                {intl.formatMessage({
                    id: 'PROPOSALS_TITLE',
                })}
            </Title>

            {/* <UserVotes /> */}

            <ProposalsTableUser />
            <ProposalsTable />
        </Container>
    )
}
