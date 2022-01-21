import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Header, Section, Title } from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { ProposalsTable } from '@/modules/Governance/components/ProposalsTable'
import { useProposals } from '@/modules/Governance/hooks'
import { error } from '@/utils'

export function RecentProposals(): JSX.Element {
    const intl = useIntl()
    const proposals = useProposals()

    const fetch = async () => {
        try {
            await proposals.fetch({
                offset: 0,
                limit: 3,
                ordering: {
                    column: 'createdAt',
                    direction: 'DESC',
                },
            })
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'GOVERNANCE_RECENT_PROPOSALS',
                    })}
                </Title>

                <Button
                    type="tertiary"
                    link="/governance/proposals"
                >
                    {intl.formatMessage({
                        id: 'PROPOSALS_VIEW_ALL',
                    })}
                </Button>
            </Header>

            <div className="card card--flat card--small">
                <Observer>
                    {() => (
                        <ProposalsTable
                            loading={proposals.loading}
                            items={proposals.items}
                        />
                    )}
                </Observer>
            </div>
        </Section>
    )
}
