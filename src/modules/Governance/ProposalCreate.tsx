import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Container } from '@/components/common/Section'
import { ProposalForm } from '@/modules/Governance/components/ProposalForm'
import { ProposalFormWarning } from '@/modules/Governance/components/ProposalFormWarning'
import { WalletConnector } from '@/modules/TonWalletConnector/Panel'
import { useProposalCreateContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalCreateInner(): JSX.Element {
    const intl = useIntl()
    const proposalCreate = useProposalCreateContext()

    return (
        <Container size="lg">
            <WalletConnector>
                {proposalCreate.canCreate === undefined ? (
                    <ContentLoader transparent />
                ) : (
                    <>
                        <Breadcrumb
                            items={[{
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

                        {proposalCreate.canCreate === true ? (
                            <ProposalForm />
                        ) : (
                            <ProposalFormWarning />
                        )}
                    </>
                )}
            </WalletConnector>
        </Container>
    )
}

export const ProposalCreate = observer(ProposalCreateInner)
