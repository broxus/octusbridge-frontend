import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Breadcrumb } from '@/components/common/Breadcrumb'
import { useProposalContext } from '@/modules/Governance/providers'

export function ProposalBreadcrumb(): JSX.Element | null {
    const intl = useIntl()
    const proposal = useProposalContext()

    return (
        <Observer>
            {() => (
                <Breadcrumb
                    items={[{
                        title: intl.formatMessage({
                            id: 'GOVERNANCE_BREADCRUMB_PROPOSALS',
                        }),
                        link: '/governance/proposals',
                    }, {
                        title: intl.formatMessage({
                            id: proposal.id && proposal.title
                                ? 'GOVERNANCE_BREADCRUMB_PROPOSAL'
                                : 'PROPOSAL_UNKNOWN_TITLE',
                        }, {
                            id: proposal.id,
                            title: proposal.title,
                        }),
                    }]}
                />
            )}
        </Observer>
    )
}
