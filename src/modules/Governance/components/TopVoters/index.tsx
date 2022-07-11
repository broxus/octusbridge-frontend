import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Align, Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { Header, Section, Title } from '@/components/common/Section'
import { UserCard } from '@/components/common/UserCard'
import { Button } from '@/components/common/Button'
import { useStakeholders } from '@/modules/Governance/hooks'
import { StakeholdersOrdering } from '@/modules/Governance/types'
import { usePagination, useTableOrder } from '@/hooks'
import { error, formattedAmount, formattedTokenAmount } from '@/utils'

import './index.scss'

export function TopVotersInner(): JSX.Element {
    const intl = useIntl()
    const stakeholders = useStakeholders()
    const pagination = usePagination(stakeholders.totalCount)
    const tableOrder = useTableOrder<StakeholdersOrdering>('voteweightdescending')

    const fetch = async () => {
        try {
            await stakeholders.fetch({
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
            })
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [
        pagination.page,
        pagination.limit,
        tableOrder.order,
    ])

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'TOP_VOTERS_TITLE',
                    })}
                </Title>

                <Button
                    type="tertiary"
                    link="/staking"
                >
                    {intl.formatMessage({
                        id: 'TOP_VOTERS_LINK',
                    })}
                </Button>
            </Header>

            <div className="card card--flat card--small">
                <Table<StakeholdersOrdering>
                    className="top-voters"
                    loading={stakeholders.loading}
                    onSort={tableOrder.onSort}
                    order={tableOrder.order}
                    cols={[{
                        name: intl.formatMessage({
                            id: 'TOP_VOTERS_ADDRESS',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'TOP_VOTERS_VOTES',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'TOP_VOTERS_VOTE_WEIGHT',
                        }),
                        align: Align.right,
                        ascending: 'voteweightascending',
                        descending: 'voteweightdescending',
                    }, {
                        name: intl.formatMessage({
                            id: 'TOP_VOTERS_PROPOSALS_VOTED',
                        }),
                        align: Align.right,
                        ascending: 'votesascending',
                        descending: 'votesdescending',
                    }]}
                    rows={stakeholders.items.map(item => ({
                        cells: [
                            <UserCard
                                copy
                                address={item.userAddress}
                                link={`/staking/explorer/${item.userAddress}`}
                            />,
                            formattedTokenAmount(item.votes),
                            `${formattedAmount(item.voteWeight)}%`,
                            item.proposalVotesCount,
                        ],
                    }))}
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

export const TopVoters = observer(TopVotersInner)
