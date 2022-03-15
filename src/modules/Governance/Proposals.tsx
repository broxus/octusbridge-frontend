import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { Container, Header, Title } from '@/components/common/Section'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { ProposalsList } from '@/modules/Governance/components/ProposalsList'
import { UserStats } from '@/modules/Governance/components/UserStats'
import { UserProposals } from '@/modules/Governance/components/UserProposals'
import { useEverWallet } from '@/stores/EverWalletService'

import './index.scss'

export function Proposals(): JSX.Element {
    const intl = useIntl()
    const tonWallet = useEverWallet()

    return (
        <Container size="lg">
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'GOVERNANCE_BREADCRUMB_OVERVIEW',
                    }),
                    link: '/governance',
                }, {
                    title: intl.formatMessage({
                        id: 'GOVERNANCE_BREADCRUMB_PROPOSALS',
                    }),
                }]}
            />

            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'PROPOSALS_TITLE',
                    })}
                </Title>

                <Button size="md" type="primary" link="/governance/proposals/create">
                    {intl.formatMessage({
                        id: 'PROPOSALS_CREATE',
                    })}
                </Button>
            </Header>

            <Observer>
                {() => (
                    tonWallet.isConnected
                        ? <UserStats />
                        : null
                )}
            </Observer>

            <Observer>
                {() => (
                    tonWallet.isConnected
                        ? <UserProposals />
                        : null
                )}
            </Observer>

            <ProposalsList />
        </Container>
    )
}
