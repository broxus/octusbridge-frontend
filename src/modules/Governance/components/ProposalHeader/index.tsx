import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Header } from '@/components/common/Section'
import { UserCard } from '@/components/common/UserCard'
import { ProposalStatus } from '@/modules/Governance/components/ProposalStatus'
import { Label } from '@/modules/Governance/components/ProposalHeader/Label'
import { useProposalContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalHeaderInner(): JSX.Element | null {
    const intl = useIntl()
    const proposal = useProposalContext()

    return (
        <Header size="lg">
            <div className="proposal-header">
                <h2 className="proposal-header__title">
                    {proposal.id && (
                        <span className="proposal-header__id">
                            {intl.formatMessage({
                                id: 'PROPOSAL_HEAD_ID',
                            }, {
                                id: proposal.id,
                            })}
                        </span>
                    )}

                    {proposal.title || intl.formatMessage({
                        id: 'PROPOSAL_UNKNOWN_TITLE',
                    })}
                </h2>

                <div className="proposal-header__info">
                    {proposal.state && (
                        <ProposalStatus state={proposal.state} />
                    )}

                    <Label />
                </div>
            </div>

            {proposal.proposer && (
                <UserCard
                    copy
                    external
                    address={proposal.proposer}
                    link={`/staking/explorer/${proposal.proposer}`}
                />
            )}
        </Header>
    )
}

export const ProposalHeader = observer(ProposalHeaderInner)
