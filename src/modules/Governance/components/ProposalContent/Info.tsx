import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { Summary } from '@/components/common/Summary'
import { useProposalContext } from '@/modules/Governance/providers'
import { dateFormat } from '@/utils'

export function ProposalInfoInner(): JSX.Element | null {
    const proposal = useProposalContext()
    const intl = useIntl()
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <>
            <div className="proposal-content__title">
                {intl.formatMessage({
                    id: 'PROPOSAL_INFO_TITLE',
                })}
            </div>

            <Summary
                compact
                space="sm"
                items={[{
                    key: intl.formatMessage({
                        id: 'PROPOSAL_INFO_ADDRESS',
                    }),
                    value: proposal.proposalAddress ? (
                        <TonscanAccountLink copy address={proposal.proposalAddress} />
                    ) : noValue,
                }, {
                    key: intl.formatMessage({
                        id: 'PROPOSAL_INFO_VOTING_START',
                    }),
                    value: proposal.startTime ? dateFormat(proposal.startTime) : noValue,
                }, {
                    key: intl.formatMessage({
                        id: 'PROPOSAL_INFO_VOTING_END',
                    }),
                    value: proposal.endTime ? dateFormat(proposal.endTime * 1000) : noValue,
                }]}
            />
        </>
    )
}

export const ProposalInfo = observer(ProposalInfoInner)
