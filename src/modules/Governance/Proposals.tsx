import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Container, Title } from '@/components/common/Section'
import { ProposalsTable } from '@/modules/Governance/ProposalsTable'
import { ProposalsTableUser } from '@/modules/Governance/ProposalsTableUser'
import { useTonWallet } from '@/stores/TonWalletService'
// import { UserVotes } from '@/modules/Governance/UserVotes'

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

            {/* <UserVotes /> */}

            <Observer>
                {() => (
                    tonWallet.isConnected
                        ? <ProposalsTableUser />
                        : null
                )}
            </Observer>

            <ProposalsTable />
        </Container>
    )
}
