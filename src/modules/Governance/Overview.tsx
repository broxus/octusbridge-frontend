import * as React from 'react'
import { useIntl } from 'react-intl'

import { Container, Title } from '@/components/common/Section'
import { RecentProposals } from '@/modules/Governance/RecentProposals'
import { TopVoters } from '@/modules/Governance/TopVoters'
import { DaoStats } from '@/modules/Governance/DaoStats'

export function Overview(): JSX.Element | null {
    const intl = useIntl()

    return (
        <Container size="lg">
            <Title size="lg">
                {intl.formatMessage({
                    id: 'GOVERNANCE_OVERVIEW',
                })}
            </Title>

            <DaoStats />
            <RecentProposals />
            <TopVoters />
        </Container>
    )
}
