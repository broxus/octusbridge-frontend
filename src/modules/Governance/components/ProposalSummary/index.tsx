import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { ProposalState } from '@/modules/Governance/types'
import './index.scss'

type Props = {
    state: ProposalState;
    id?: number;
}

const intlIdMap = new Map<ProposalState, string>([
    ['Pending', 'PROPOSAL_SUMMARY_PENDING'],
    ['Active', 'PROPOSAL_SUMMARY_ACTIVE'],
    ['Canceled', 'PROPOSAL_SUMMARY_CANCELED'],
    ['Failed', 'PROPOSAL_SUMMARY_FAILED'],
    ['Succeeded', 'PROPOSAL_SUMMARY_SUCCEEDED'],
    ['Expired', 'PROPOSAL_SUMMARY_EXPIRED'],
    ['Queued', 'PROPOSAL_SUMMARY_QUEUED'],
    ['Executed', 'PROPOSAL_SUMMARY_EXECUTED'],
])

export function ProposalSummary({
    state,
    id,
}: Props): JSX.Element {
    const intl = useIntl()
    const intlId = intlIdMap.get(state) || 'PROPOSAL_SUMMARY_UNKNOWN'

    if (id) {
        return (
            <Link className="proposal-summary" to={`/governance/proposals/${id}`}>
                {intl.formatMessage({ id: intlId })}
                <Icon icon="link" />
            </Link>
        )
    }

    return (
        <span className="proposal-summary">
            {intl.formatMessage({ id: intlId })}
        </span>
    )
}
