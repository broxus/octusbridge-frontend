import * as React from 'react'
import { useIntl } from 'react-intl'

import { Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { AmountCard } from '@/components/common/AmountCard'
import { UserCard } from '@/components/common/UserCard'
import { dateFormat } from '@/utils'

import './index.scss'

export function Rounds(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="rounds">
            <div className="rounds__filters">
            </div>

            <div className="card card--small card--flat">
                <Table
                    className="rounds__table"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_ROUND',
                        }),
                        align: 'left',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_STAKE',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_EVENTS',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_TON_TO_ETH',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_ETH_TO_TON',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_START',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'ROUNDS_TABLE_END',
                        }),
                        align: 'right',
                    }]}
                    rows={[{
                        link: '/relayers/validation-round/1',
                        cells: [
                            <UserCard
                                address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
                                name="123"
                            />,
                            <AmountCard
                                changesDirection={-1}
                                priceChange="12"
                                value="240000"
                            />,
                            <AmountCard
                                changesDirection={1}
                                priceChange="22"
                                value="657521"
                            />,
                            <AmountCard
                                changesDirection={0}
                                priceChange="22"
                                value="65721"
                            />,
                            <AmountCard
                                changesDirection={0}
                                priceChange="12"
                                value="123000"
                            />,
                            dateFormat(new Date().getTime()),
                            dateFormat(new Date().getTime()),
                        ],
                    }, {
                        link: '/relayers/validation-round/1',
                        cells: [
                            <UserCard
                                address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
                                name="123"
                            />,
                            <AmountCard
                                changesDirection={-1}
                                priceChange="12"
                                value="2400000"
                            />,
                            <AmountCard
                                changesDirection={1}
                                priceChange="22"
                                value="657521"
                            />,
                            <AmountCard
                                changesDirection={0}
                                priceChange="22"
                                value="65721"
                            />,
                            <AmountCard
                                changesDirection={0}
                                priceChange="12"
                                value="949080"
                            />,
                            dateFormat(new Date().getTime()),
                            dateFormat(new Date().getTime()),
                        ],
                    }]}
                />

                <Pagination
                    limit={10}
                    current={1}
                    onSubmit={() => {}}
                />
            </div>
        </div>
    )
}
