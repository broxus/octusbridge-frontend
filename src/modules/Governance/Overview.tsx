import * as React from 'react'
import { useIntl } from 'react-intl'

import { Container, Title } from '@/components/common/Section'
import { RecentProposals } from '@/modules/Governance/components/RecentProposals'
import { TopVoters } from '@/modules/Governance/components/TopVoters'
import { DaoStats } from '@/modules/Governance/components/DaoStats'

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
