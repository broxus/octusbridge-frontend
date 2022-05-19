import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Align, Table } from '@/components/common/Table'
import { Header, Section, Title } from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import { UserCard } from '@/components/common/UserCard'
import { useRelaysRoundInfoContext } from '@/modules/Relayers/providers'
import { RelaysRoundInfoOrdering } from '@/modules/Relayers/types'
import { formattedAmount } from '@/utils'
import { usePagination, useTableOrder } from '@/hooks'
import { Ratio } from '@/components/common/Ratio'

import './index.scss'

type Props = {
    roundNum: number;
}

function RoundRelayersInner({
    roundNum,
}: Props): JSX.Element {
    const intl = useIntl()
    const relayers = useRelaysRoundInfoContext()
    const pagination = usePagination(relayers.totalCount)
    const tableOrder = useTableOrder<RelaysRoundInfoOrdering>('stakedescending')

    React.useEffect(() => {
        relayers.fetch({
            roundNum,
            limit: pagination.limit,
            offset: pagination.offset,
            ordering: tableOrder.order,
        })
    }, [
        roundNum,
        pagination.offset,
        pagination.limit,
        tableOrder.order,
    ])

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'RELAYERS_TITLE',
                    })}
                </Title>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    onSort={tableOrder.onSort}
                    order={tableOrder.order}
                    loading={relayers.isLoading}
                    className="round-relayers-table"
                    cols={[{
                        name: '#',
                    }, {
                        name: intl.formatMessage({
                            id: 'RELAYERS_RELAYER',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'RELAYERS_STAKE',
                        }),
                        align: Align.right,
                        ascending: 'stakeascending',
                        descending: 'stakedescending',
                    }, {
                        name: intl.formatMessage({
                            id: 'RELAYERS_EVENTS_CONFIRMED',
                        }),
                        align: Align.right,
                    }]}
                    rows={relayers.list?.map((item, index) => ({
                        cells: [
                            index + pagination.offset + 1,
                            <UserCard
                                address={item.relayAddress}
                                link={`/relayers/${item.relayAddress}`}
                            />,
                            formattedAmount(item.stake),
                            <Ratio
                                total={item.totalRoundConfirms}
                                value={item.eventsConfirmed}
                            />,
                        ],
                    }))}
                />

                <Pagination
                    page={pagination.page}
                    count={pagination.limit}
                    totalCount={pagination.totalCount}
                    totalPages={pagination.totalPages}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const RoundRelayers = observer(RoundRelayersInner)
