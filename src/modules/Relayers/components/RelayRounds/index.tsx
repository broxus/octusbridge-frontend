import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Align, Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { AmountCard } from '@/components/common/AmountCard'
import { UserCard } from '@/components/common/UserCard'
import { Ratio } from '@/components/common/Ratio'
import { useAllRelayRoundsInfoContext } from '@/modules/Relayers/providers'
import { AllRelayRoundsInfoOrdering } from '@/modules/Relayers/types'
import { usePagination, useTableOrder } from '@/hooks'
import { DateCard } from '@/components/common/DateCard'

import './index.scss'

type Props = {
    relayAddress: string;
}

function RelayRoundsInner({
    relayAddress,
}: Props): JSX.Element {
    const intl = useIntl()
    const relayRoundInfo = useAllRelayRoundsInfoContext()
    const pagination = usePagination(relayRoundInfo.totalCount)
    const tableOrder = useTableOrder<AllRelayRoundsInfoOrdering>('roundnumdescending')

    React.useEffect(() => {
        relayRoundInfo.fetch({
            userAddress: relayAddress,
            limit: pagination.limit,
            offset: pagination.offset,
            ordering: tableOrder.order,
        })
    }, [
        pagination.limit,
        pagination.offset,
        tableOrder.order,
    ])

    return (
        <div className="card card--small card--flat">
            <Table<AllRelayRoundsInfoOrdering>
                onSort={tableOrder.onSort}
                order={tableOrder.order}
                loading={relayRoundInfo.isLoading}
                className="relay-rounds-table"
                cols={[{
                    name: intl.formatMessage({
                        id: 'ROUNDS_TABLE_ROUND',
                    }),
                    ascending: 'roundnumascending',
                    descending: 'roundnumdescending',
                }, {
                    name: intl.formatMessage({
                        id: 'ROUNDS_TABLE_TOTAL_STAKE',
                    }),
                    align: Align.right,
                }, {
                    name: intl.formatMessage({
                        id: 'ROUNDS_TABLE_EVENTS',
                    }),
                    align: Align.right,
                }, {
                    name: intl.formatMessage({
                        id: 'ROUNDS_TABLE_START',
                    }),
                    align: Align.right,
                }, {
                    name: intl.formatMessage({
                        id: 'ROUNDS_TABLE_END',
                    }),
                    align: Align.right,
                }]}
                rows={relayRoundInfo.list?.map(item => ({
                    cells: [
                        <UserCard
                            address={item.roundAddress}
                            name={item.roundNum.toString()}
                            link={`/relayers/round/${item.roundNum}`}
                        />,
                        <AmountCard
                            showPriceChange={false}
                            value={item.stake}
                        />,
                        <Ratio
                            total={item.totalRoundConfirms}
                            value={item.eventsConfirmed}
                        />,
                        <DateCard time={item.startTime} />,
                        <DateCard time={item.endTime} />,
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
    )
}

export const RelayRounds = observer(RelayRoundsInner)
