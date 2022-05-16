import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import BigNumber from 'bignumber.js'

import { Align, Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { AmountCard } from '@/components/common/AmountCard'
import { UserCard } from '@/components/common/UserCard'
import { dateFormat } from '@/utils'
import { useRelayRoundsInfoContext } from '@/modules/Relayers/providers'
import { RelayRoundsInfoOrdering } from '@/modules/Relayers/types'
import { usePagination, useTableOrder } from '@/hooks'

import './index.scss'

function RoundsInner(): JSX.Element {
    const intl = useIntl()
    const relayRoundInfo = useRelayRoundsInfoContext()
    const pagination = usePagination(relayRoundInfo.totalCount)
    const tableOrder = useTableOrder<RelayRoundsInfoOrdering>('roundnumdescending')

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    React.useEffect(() => {
        relayRoundInfo.fetch({
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
        <div className="rounds">
            <div className="card card--small card--flat">
                <Table<RelayRoundsInfoOrdering>
                    onSort={tableOrder.onSort}
                    order={tableOrder.order}
                    loading={relayRoundInfo.isLoading}
                    className="rounds__table"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_ROUND',
                        }),
                        ascending: 'roundnumascending',
                        descending: 'roundnumdescending',
                    }, {
                        name: intl.formatMessage({
                            // id: 'ROUNDS_TABLE_STAKE',
                            id: 'ROUNDS_TABLE_TOTAL_STAKE',
                        }),
                        align: Align.right,
                        ascending: 'stakeascending',
                        descending: 'stakedescending',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_EVENTS',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_TON_TO_ETH',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_ETH_TO_TON',
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
                            <AmountCard
                                showPriceChange={false}
                                value={item.eventsConfirmed.toString()}
                            />,
                            <AmountCard
                                changesDirection={0}
                                priceChange={new BigNumber(item.fromTonUsdtShare).times(100).dp(2).toFixed()}
                                value={item.fromTonUsdt}
                            />,
                            <AmountCard
                                changesDirection={0}
                                priceChange={new BigNumber(item.toTonUsdtShare).times(100).dp(2).toFixed()}
                                value={item.toTonUsdt}
                            />,
                            item.startTime ? dateFormat(item.startTime) : noValue,
                            item.endTime ? dateFormat(item.endTime) : noValue,
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
        </div>
    )
}

export const Rounds = observer(RoundsInner)
