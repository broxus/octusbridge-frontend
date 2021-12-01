import * as React from 'react'
import { useIntl } from 'react-intl'

import { Popup } from '@/components/common/Popup'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Pagination } from '@/components/common/Pagination'
import { Summary } from '@/components/common/Summary'
import { Button } from '@/components/common/Button'
import { Table } from '@/components/common/Table'
import { ProposalSummary } from '@/modules/Governance/components/ProposalSummary'
import { ProposalState } from '@/modules/Governance/types'
import { usePagination } from '@/hooks'

import './index.scss'

type Proposal = {
    id: number;
    state: ProposalState;
}

type Props = {
    proposals?: Proposal[];
    loading?: boolean;
    disabled?: boolean;
    totalCount?: number;
    onDismiss: () => void;
    onSubmit: () => void;
    onChangePage?: (page: number) => void;
}

// TODO: VotingPower
export function UnlockForm({
    proposals = [],
    loading,
    disabled,
    totalCount,
    onDismiss,
    onSubmit,
    onChangePage,
}: Props): JSX.Element {
    const intl = useIntl()
    const pagination = usePagination(totalCount)
    const submitDisabled = proposals.length === 0 || disabled || loading
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Popup
            disabled={disabled}
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
                                item.id,
                                <ProposalSummary
                                    state={item.state}
                                    id={item.id}
                                />,
                                noValue,
                            ],
                        }))}
                    />

                    {onChangePage && pagination.totalPages > 1 && (
                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            className="unlock-form__pagination"
                            onSubmit={onChangePage}
                        />
                    )}

                    <Summary
                        items={[{
                            key: intl.formatMessage({
                                id: 'UNLOCK_FORM_GAZ',
                            }),
                            value: intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: '50.00',
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
                    disabled={disabled}
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'UNLOCK_FORM_CANCEL',
                    })}
                </Button>
                <Button
                    block
                    type="primary"
                    disabled={submitDisabled}
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
