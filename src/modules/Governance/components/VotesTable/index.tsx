import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Header, Section, Title } from '@/components/common/Section'
import { Align, Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { UserCard } from '@/components/common/UserCard'
import { VoteType } from '@/modules/Governance/components/VoteType'
import { VoteReason } from '@/modules/Governance/components/VoteReason'
import { useProposalContext } from '@/modules/Governance/providers'
import {
    dateFormat, error, formattedTokenAmount,
} from '@/utils'
import { usePagination } from '@/hooks'
import { DexConstants } from '@/misc'

import './index.scss'

export function VotesTableInner(): JSX.Element {
    const intl = useIntl()
    const proposal = useProposalContext()
    const pagination = usePagination(proposal.allVotes.totalCount)

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await proposal.allVotes.fetch({
                proposalId: proposal.id,
                limit: pagination.limit,
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
        if (proposal.id) {
            fetch()
        }
        else {
            proposal.allVotes.dispose()
        }
    }, [
        proposal.id,
        pagination.page,
        pagination.limit,
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
                    loading={proposal.allVotes.loading}
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
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'VOTES_TABLE_DATE',
                        }),
                        align: Align.right,
                    }]}
                    rows={proposal.allVotes.items.map(item => ({
                        cells: [
                            <UserCard
                                copy
                                address={item.voter}
                                link={`/staking/explorer/${item.voter}`}
                            />,
                            item.reason ? <VoteReason value={item.reason} /> : noValue,
                            <VoteType
                                badge
                                type={item.support ? 1 : 0}
                                value={item.votes
                                    ? formattedTokenAmount(item.votes, DexConstants.CoinDecimals)
                                    : undefined}
                            />,
                            dateFormat(item.createdAt * 1000),
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

export const VotesTable = observer(VotesTableInner)
