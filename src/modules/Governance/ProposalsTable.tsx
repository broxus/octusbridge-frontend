import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Header, Section, Title } from '@/components/common/Section'
import { Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { ProposalSummary } from '@/modules/Governance/components/ProposalSummary'
import { ProposalStatus } from '@/modules/Governance/components/ProposalStatus'
import { ProposalProgress } from '@/modules/Governance/components/ProposalProgress'
import { ProposalsFilters } from '@/modules/Governance/components/ProposalsFilters'
import { DateCard } from '@/modules/Governance/components/DateCard'
import { useProposals, useProposalsFilters } from '@/modules/Governance/hooks'
import { ProposalsFilters as Filters } from '@/modules/Governance/types'
import { usePagination } from '@/hooks'
import { error } from '@/utils'

import './index.scss'

export function ProposalsTableInner(): JSX.Element {
    const intl = useIntl()
    const proposals = useProposals()
    const pagination = usePagination(proposals.totalCount)
    const [filters, setFilters] = useProposalsFilters()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const changeFilters = (localFilters: Filters) => {
        pagination.submit(1)
        setFilters(localFilters)
    }

    const fetch = async () => {
        try {
            await proposals.fetch({
                startTimeGe: filters.startTimeGe,
                startTimeLe: filters.startTimeLe,
                endTimeGe: filters.endTimeGe,
                endTimeLe: filters.endTimeLe,
                state: filters.state,
                offset: pagination.offset,
                limit: pagination.limit,
                ordering: {
                    column: 'createdAt',
                    direction: 'DESC',
                },
            })
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [
        filters.state,
        filters.endTimeGe,
        filters.endTimeLe,
        filters.startTimeGe,
        filters.startTimeLe,
        pagination.page,
    ])

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'PROPOSALS_ALL_TITLE',
                    })}
                </Title>

                <ProposalsFilters
                    filters={filters}
                    onChangeFilters={changeFilters}
                />
            </Header>

            <div className="card card--flat card--small">
                <Table
                    className="proposals-table"
                    loading={proposals.loading}
                    cols={[{
                        name: intl.formatMessage({
                            id: 'PROPOSALS_TABLE_NO',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'PROPOSALS_TABLE_SUMMARY',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'PROPOSALS_TABLE_STATUS',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'PROPOSALS_TABLE_VOTING',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'PROPOSALS_TABLE_DATE',
                        }),
                        align: 'right',
                    }]}
                    rows={proposals.items.map(item => ({
                        cells: [
                            item.proposalId || noValue,
                            item.state ? (
                                <ProposalSummary
                                    state={item.state}
                                    id={item.proposalId}
                                />
                            ) : noValue,
                            item.state ? <ProposalStatus state={item.state} /> : noValue,
                            <ProposalProgress
                                againstVotes={item.againstVotes}
                                forVotes={item.forVotes}
                            />,
                            item.endTime ? <DateCard timestamp={item.endTime} /> : noValue,
                        ],
                    }))}
                />

                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const ProposalsTable = observer(ProposalsTableInner)
