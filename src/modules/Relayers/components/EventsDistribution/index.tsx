import * as React from 'react'
import { useIntl } from 'react-intl'

import { Table } from '@/components/common/Table'
import { Checkbox } from '@/components/common/Checkbox'
import { Chart } from '@/modules/Relayers/components/EventsDistribution/chart'

import './index.scss'

export function EventsDistribution(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--flat card--small events-distribution">
            <h3 className="events-distribution__title">
                {intl.formatMessage({
                    id: 'EVENTS_DISTRIBUTION_TITLE',
                })}
            </h3>

            <Chart
                data={[{
                    amount: '1000000000',
                    color: '#3A458C',
                    decimals: 9,
                    name: 'EVER to ETH',
                }, {
                    amount: '2005600000',
                    color: '#AD90E9',
                    decimals: 9,
                    name: 'ETH to EVER',
                }]}
            />

            <Table
                className="events-distribution__table"
                cols={[{
                    align: 'center',
                }, {
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_TABLE_TYPE',
                    }),
                    align: 'left',
                }, {
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_TABLE_AMOUNT',
                    }),
                    align: 'right',
                }, {
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_TABLE_SHARE',
                    }),
                    align: 'right',
                }]}
                rows={[{
                    link: '/',
                    cells: [
                        <Checkbox />,
                        'EVER to ETH',
                        '949 080.00',
                        '67.28%',
                    ],
                }, {
                    link: '/',
                    cells: [
                        <Checkbox />,
                        'ETH to EVER',
                        '370 920.00',
                        '32.72%',
                    ],
                }]}
            />
        </div>
    )
}
