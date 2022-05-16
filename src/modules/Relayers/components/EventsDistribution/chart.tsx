import * as React from 'react'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'

import { ContentLoader } from '@/components/common/ContentLoader'
import { PieChart } from '@/components/common/PieChart'
import { formattedAmount } from '@/utils'

import './index.scss'

type Props = {
    isLoading?: boolean;
    tonToEthUsdt?: string;
    ethToTonUsdt?: string;
}

export function Chart({
    isLoading,
    ethToTonUsdt,
    tonToEthUsdt,
}: Props): JSX.Element | null {
    const intl = useIntl()

    if (!tonToEthUsdt || !ethToTonUsdt) {
        return null
    }

    const data = [{
        color: '#AD90E9',
        amount: tonToEthUsdt,
        name: intl.formatMessage({
            id: 'EVENTS_DISTRIBUTION_EVER',
        }),
    }, {
        color: '#3A458C',
        amount: ethToTonUsdt,
        name: intl.formatMessage({
            id: 'EVENTS_DISTRIBUTION_ETH',
        }),
    }]
        .filter(item => !new BigNumber(item.amount).isZero())

    const pieData = data.map(item => ({
        value: item.amount,
        color: item.color,
    }))

    return (
        <div className="events-distribution__chart">
            {isLoading && (
                <div className="events-distribution__spinner">
                    <ContentLoader slim transparent />
                </div>
            )}

            <PieChart
                data={pieData}
                renderTooltip={(index, percent) => (
                    <div>
                        <div>
                            <strong>{data[index].name}</strong>
                        </div>
                        <div>
                            {`$${formattedAmount(data[index].amount)}`}
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
