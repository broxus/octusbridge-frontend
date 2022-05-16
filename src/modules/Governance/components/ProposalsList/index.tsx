import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Header, Section, Title } from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import { ProposalsFilters } from '@/modules/Governance/components/ProposalsFilters'
import { ProposalsTable } from '@/modules/Governance/components/ProposalsTable'
import { useProposals, useProposalsFilters } from '@/modules/Governance/hooks'
import { ProposalsFilters as Filters } from '@/modules/Governance/types'
import { usePagination } from '@/hooks'
import { error } from '@/utils'

export function ProposalsListInner(): JSX.Element {
    const intl = useIntl()
    const proposals = useProposals()
    const pagination = usePagination(proposals.totalCount)
    const [filters, setFilters] = useProposalsFilters()

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
        pagination.limit,
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
                <ProposalsTable
                    loading={proposals.loading}
                    items={proposals.items}
                />

                <Pagination
                    page={pagination.page}
                    count={pagination.limit}
                    totalPages={pagination.totalPages}
                    totalCount={pagination.totalCount}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const ProposalsList = observer(ProposalsListInner)
