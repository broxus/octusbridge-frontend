import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Header, Section, Title } from '@/components/common/Section'
import { Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { UserCard } from '@/components/common/UserCard'
import { VoteType } from '@/modules/Governance/components/VoteType'
import { VoteReason } from '@/modules/Governance/components/VoteReason'
import { useVotesStore } from '@/modules/Governance/hooks'
import { dateFormat, error, formattedAmount } from '@/utils'
import { usePagination } from '@/hooks'
import { DexConstants } from '@/misc'

import './index.scss'

type Props = {
    proposalId?: number;
}

export function VotesTableInner({
    proposalId,
}: Props): JSX.Element {
    const intl = useIntl()
    const votes = useVotesStore()
    const pagination = usePagination(votes.totalCount)

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await votes.fetch({
                proposalId,
                limit: 10,
                offset: pagination.offset,
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
        if (proposalId) {
            fetch()
        }
        else {
            votes.dispose()
        }
    }, [
        proposalId,
        pagination.page,
    ])

    return (
        <Section id="votes">
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'VOTES_TABLE_TITLE',
                    })}
                </Title>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    loading={votes.loading}
                    className="votes-table"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'VOTES_TABLE_VOTER',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'VOTES_TABLE_REASON',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'VOTES_TABLE_VOTING',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'VOTES_TABLE_DATE',
                        }),
                        align: 'right',
                    }]}
                    rows={votes.items.map(item => ({
                        cells: [
                            <UserCard
                                copy
                                address={item.voter}
                                link={`/staking/explorer/${item.voter}`}
                            />,
                            item.reason ? <VoteReason value={item.reason} /> : noValue,
                            <VoteType
                                badge
                                type={item.support === true ? 1 : 0}
                                value={item.votes
                                    ? formattedAmount(item.votes, DexConstants.TONDecimals, true, true)
                                    : undefined}
                            />,
                            dateFormat(item.createdAt * 1000),
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

export const VotesTable = observer(VotesTableInner)
