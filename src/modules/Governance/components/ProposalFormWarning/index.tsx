import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { formattedTokenAmount } from '@/utils'
import { useProposalCreateContext } from '@/modules/Governance/providers'

import './index.scss'

export function ProposalFormWarningInner(): JSX.Element | null {
    const intl = useIntl()
    const proposalCreate = useProposalCreateContext()

    if (!proposalCreate.tokenMissing && !proposalCreate.threshold) {
        return null
    }

    if (!proposalCreate.token?.decimals) {
        return null
    }

    return (
        <div className="card card--flat card--small">
            <div className="proposal-form-warning">
                <Icon icon="warning" />

                <h2 className="proposal-form-warning__title">
                    {intl.formatMessage({
                        id: 'PROPOSAL_FORM_WARNING_TITLE',
                    })}
                </h2>

                <div className="proposal-form-warning__text text-muted">
                    {proposalCreate.hasLockedTokens && proposalCreate.lockedTokens ? (
                        intl.formatMessage({
                            id: 'PROPOSAL_FORM_LOCKED_TEXT',
                        }, {
                            locked: formattedTokenAmount(
                                proposalCreate.lockedTokens,
                                proposalCreate.token.decimals,
                            ),
                            amount: formattedTokenAmount(
                                proposalCreate.tokenMissing || proposalCreate.threshold,
                                proposalCreate.token.decimals,
                            ),
                        })
                    ) : (
                        intl.formatMessage({
                            id: 'PROPOSAL_FORM_WARNING_TEXT',
                        }, {
                            amount: formattedTokenAmount(
                                proposalCreate.tokenMissing || proposalCreate.threshold,
                                proposalCreate.token.decimals,
                            ),
                        })
                    )}
                </div>

                <Button type="primary" size="md" link="/staking/my">
                    {intl.formatMessage({
                        id: 'PROPOSAL_FORM_LINK',
                    })}
                </Button>
            </div>
        </div>
    )
}

export const ProposalFormWarning = observer(ProposalFormWarningInner)
