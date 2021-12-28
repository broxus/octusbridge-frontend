import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Container, Title } from '@/components/common/Section'
import { AllProposals } from '@/modules/Governance/AllProposals'
import { UserProposals } from '@/modules/Governance/UserProposals'
import { useTonWallet } from '@/stores/TonWalletService'
import { UserStats } from '@/modules/Governance/UserStats'

import './index.scss'

export function Proposals(): JSX.Element {
    const intl = useIntl()
    const tonWallet = useTonWallet()

    return (
        <Container size="lg">
            <Title size="lg">
                {intl.formatMessage({
                    id: 'PROPOSALS_TITLE',
                })}
            </Title>

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

            <AllProposals />
        </Container>
    )
}
