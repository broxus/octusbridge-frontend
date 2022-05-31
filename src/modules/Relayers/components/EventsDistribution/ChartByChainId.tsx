import * as React from 'react'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'
import { PieChart } from '@/components/common/PieChart'
import { getEvmNetworkColor, getEvmNetworkName } from '@/modules/Relayers/utils'

import './index.scss'

type Data = {
    chainId: number;
    amount: number;
}

type Props = {
    isLoading?: boolean;
    data?: Data[];
}

export function ChartByChainId({
    isLoading,
    data,
}: Props): JSX.Element | null {
    const intl = useIntl()

    if (!data) {
        return null
    }

    const _data = data
        .filter(item => item.amount !== 0)
        .map(item => ({
            color: getEvmNetworkColor(item.chainId),
            amount: item.amount.toString(),
            name: getEvmNetworkName(item.chainId) ?? intl.formatMessage({
                id: 'NA',
            }),
        }))

    const pieData = _data
        .map(item => ({
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
                            <strong>{_data[index].name}</strong>
                        </div>
                        <div>
                            {_data[index].amount}
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
