import * as React from 'react'
import { useIntl } from 'react-intl'

import { PieChart } from '@/components/common/PieChart'
import { formattedAmount } from '@/utils'

import './index.scss'

type Item = {
    name: string;
    color: string;
    amount: string;
    decimals: number;
}

type Props = {
    data: Item[];
}

export function Chart({
    data,
}: Props): JSX.Element {
    const intl = useIntl()
    const pieData = data.map(item => ({
        value: item.amount,
        color: item.color,
    }))

    return (
        <div className="events-distribution__chart">
            <PieChart
                data={pieData}
                renderTooltip={(index, percent) => (
                    <div>
                        <div>
                            <strong>{data[index].name}</strong>
                        </div>
                        <div>
                            {intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: formattedAmount(data[index].amount, data[index].decimals),
                                symbol: 'BRIDGE',
                            })}
                        </div>
                        <div>
                            {percent}
                            %
                        </div>

                    </div>
                )}
            />
        </div>
    )
}
