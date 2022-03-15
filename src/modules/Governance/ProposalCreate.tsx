import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer, observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Container, Title } from '@/components/common/Section'
import { ProposalForm } from '@/modules/Governance/components/ProposalForm'
import { ProposalFormWarning } from '@/modules/Governance/components/ProposalFormWarning'
import { WalletConnector } from '@/modules/TonWalletConnector'
import { useProposalCreateContext } from '@/modules/Governance/providers'
import { useDebounce } from '@/hooks'
import { useEverWallet } from '@/stores/EverWalletService'

import './index.scss'

export function ProposalCreateInner(): JSX.Element | null {
    const intl = useIntl()
    const wallet = useEverWallet()
    const proposalCreate = useProposalCreateContext()
    const isInitializing = useDebounce(wallet.isInitializing, 100)

    if (isInitializing) {
        return null
    }

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
                    link: '/governance/proposals',
                }, {
                    title: intl.formatMessage({
                        id: 'GOVERNANCE_BREADCRUMB_CREATE',
                    }),
                }]}
            />

            <Title size="lg">
                {intl.formatMessage({
                    id: 'PROPOSAL_FORM_TITLE',
                })}
            </Title>

            <WalletConnector>
                <Observer>
                    {() => (
                        /* eslint-disable no-nested-ternary */
                        proposalCreate.canCreate === undefined ? (
                            <div className="card card--flat card--small">
                                <ContentLoader transparent />
                            </div>
                        ) : (
                            proposalCreate.canCreate === true ? (
                                <ProposalForm />
                            ) : (
                                <ProposalFormWarning />
                            )
                        )
                    )}
                </Observer>
            </WalletConnector>
        </Container>
    )
}

export const ProposalCreate = observer(ProposalCreateInner)
