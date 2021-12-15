import * as React from 'react'
import { useIntl } from 'react-intl'

import { Popup } from '@/components/common/Popup'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Summary } from '@/components/common/Summary'
import { Button } from '@/components/common/Button'
import { Table } from '@/components/common/Table'
import { ProposalSummary } from '@/modules/Governance/components/ProposalSummary'
import { calcGazToUnlockVotes } from '@/modules/Governance/utils'
import { Proposal } from '@/modules/Governance/types'
import { DexConstants } from '@/misc'
import { formattedAmount } from '@/utils'

import './index.scss'

type Props = {
    tokens?: string;
    loading?: boolean;
    proposals: Proposal[];
    onDismiss: () => void;
    onSubmit: () => void;
}

// TODO: VotingPower
export function UnlockForm({
    tokens,
    loading,
    proposals,
    onDismiss,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Popup
            disabled={loading}
            className="unlock-form"
            onDismiss={onDismiss}
        >
            <h2 className="unlock-form__title">
                {intl.formatMessage({
                    id: 'UNLOCK_FORM_TITLE',
                })}
            </h2>

            {proposals.length > 0 ? (
                <>
                    <Table
                        className="unlock-form__table"
                        cols={[{
                            name: intl.formatMessage({
                                id: 'UNLOCK_FORM_ID',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'UNLOCK_FORM_SUMMARY',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'UNLOCK_FORM_TOKENS',
                            }),
                            align: 'right',
                        }]}
                        rows={proposals.map(item => ({
                            cells: [
                                item.proposalId,
                                item.state ? (
                                    <ProposalSummary
                                        state={item.state}
                                        id={item.proposalId}
                                    />
                                ) : noValue,
                                tokens || noValue,
                            ],
                        }))}
                    />

                    <Summary
                        items={[{
                            key: intl.formatMessage({
                                id: 'UNLOCK_FORM_GAZ',
                            }),
                            value: intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: formattedAmount(
                                    calcGazToUnlockVotes(proposals.length),
                                    DexConstants.TONDecimals,
                                ),
                                symbol: 'TON',
                            }),
                        }]}
                    />
                </>
            ) : (
                <div className="unlock-form__empty">
                    {intl.formatMessage({
                        id: 'UNLOCK_FORM_NO_PROPOSALS',
                    })}
                </div>
            )}

            <div className="unlock-form__actions">
                <Button
                    block
                    type="secondary"
                    disabled={loading}
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'UNLOCK_FORM_CANCEL',
                    })}
                </Button>
                <Button
                    block
                    type="primary"
                    disabled={proposals.length === 0 || loading}
                    onClick={onSubmit}
                >
                    {loading ? (
                        <ContentLoader slim transparent />
                    ) : (
                        intl.formatMessage({
                            id: 'UNLOCK_FORM_UNLOCK',
                        })
                    )}
                </Button>
            </div>
        </Popup>
    )
}
