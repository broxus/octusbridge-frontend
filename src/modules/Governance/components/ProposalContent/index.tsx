import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Line, Section, Title } from '@/components/common/Section'
import { Collapse } from '@/components/common/Collapse'
import { Markdown } from '@/components/common/Markdown'
import { Icon } from '@/components/common/Icon'
import { EthActionData, TonActionData } from '@/modules/Governance/components/ActionData'
import { ProposalConfig } from '@/modules/Governance/components/ProposalContent/Config'
import { ProposalInfo } from '@/modules/Governance/components/ProposalContent/Info'
import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalContentInner(): JSX.Element | null {
    const proposal = useProposalContext()
    const intl = useIntl()

    return (
        <Section className="proposal-content">
            <Title>
                {intl.formatMessage({
                    id: 'PROPOSAL_CONTENT_TITLE',
                })}
            </Title>

            <div className="card card--flat card--small">
                <div className="proposal-content__head">
                    <div className="proposal-content__title">
                        {intl.formatMessage({
                            id: 'PROPOSAL_CONTENT_DESCRIPTION',
                        })}
                    </div>

                    {proposal.link ? (
                        <a
                            href={proposal.link}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="proposal-content__discussion"
                        >
                            {intl.formatMessage({
                                id: 'PROPOSAL_CONTENT_DISCUSSION',
                            })}
                            <Icon icon="externalLink" ratio={0.75} />
                        </a>
                    ) : null}
                </div>

                <div className="proposal-content__body">
                    {proposal.description
                        ? (
                            <Markdown value={proposal.description} />
                        )
                        : intl.formatMessage({
                            id: 'PROPOSAL_NO_DESCRIPTION',
                        })}
                </div>

                <div className="proposal-content__title">
                    {intl.formatMessage({
                        id: 'PROPOSAL_CONTENT_ACTIONS',
                    })}
                </div>

                {proposal.ethActions.length === 0 && proposal.tonActions.length === 0 ? (
                    <div className="proposal-content__body">
                        {intl.formatMessage({
                            id: 'PROPOSAL_NO_ACTIONS',
                        })}
                    </div>
                ) : (
                    <>
                        <Line type="light" />

                        {proposal.ethActions.length > 0 && (
                            <>
                                <Collapse
                                    title={intl.formatMessage({
                                        id: 'PROPOSAL_CONTENT_ETH_ACTIONS',
                                    })}
                                >
                                    {proposal.ethActions.map((action, index) => (
                                        /* eslint-disable react/no-array-index-key */
                                        <React.Fragment key={index}>
                                            <Line type="light" />

                                            <EthActionData
                                                callData={action.callData}
                                                chainId={action.chainId}
                                                signature={action.signature}
                                                target={action.target}
                                                value={action.value}
                                            />
                                        </React.Fragment>
                                    ))}
                                </Collapse>

                                <Line type="light" />
                            </>
                        )}

                        {proposal.tonActions.length > 0 && (
                            <>
                                <Collapse
                                    title={intl.formatMessage({
                                        id: 'PROPOSAL_CONTENT_TON_ACTIONS',
                                    })}
                                >
                                    {proposal.tonActions.map((action, index) => (
                                        <React.Fragment key={index}>
                                            <Line type="light" />

                                            <TonActionData
                                                payload={action.payload}
                                                target={action.target}
                                                value={action.value}
                                            />
                                        </React.Fragment>
                                    ))}
                                </Collapse>

                                <Line type="light" />
                            </>
                        )}
                    </>
                )}

                <ProposalInfo />

                <ProposalConfig />
            </div>
        </Section>
    )
}

export const ProposalContent = observer(ProposalContentInner)
