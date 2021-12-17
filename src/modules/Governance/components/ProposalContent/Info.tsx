import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Icon } from '@/components/common/Icon'
import { Copy } from '@/components/common/Copy'
import { Summary } from '@/components/common/Summary'
import { useProposalContext } from '@/modules/Governance/providers'
import { sliceAddress } from '@/utils'

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
                    id: 'PROPOSAL_DATA_TITLE',
                })}
            </div>

            <Summary
                compact
                space="sm"
                items={[{
                    key: intl.formatMessage({
                        id: 'PROPOSAL_DATA_ADDRESS',
                    }),
                    value: proposal.proposalAddress ? (
                        <div className="explorer-link">
                            {sliceAddress(proposal.proposalAddress)}

                            <Copy text={proposal.proposalAddress} id="copy-proposal-address">
                                <Icon icon="copy" />
                            </Copy>
                        </div>
                    ) : noValue,
                }]}
            />
        </>
    )
}

export const ProposalInfo = observer(ProposalInfoInner)
