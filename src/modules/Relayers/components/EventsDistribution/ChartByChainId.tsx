import * as React from 'react'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'
import { PieChart } from '@/components/common/PieChart'
import { EvmStats } from '@/modules/Relayers/types'
import { getEvmNetworkColor, getEvmNetworkName } from '@/modules/Relayers/utils'

import './index.scss'

type Props = {
    isLoading?: boolean;
    evmStats?: EvmStats[];
}

export function ChartByChainId({
    isLoading,
    evmStats,
}: Props): JSX.Element | null {
    const intl = useIntl()

    if (!evmStats) {
        return null
    }

    const data = evmStats
        .filter(item => item.relayConfirmed !== 0)
        .map(item => ({
            color: getEvmNetworkColor(item.chainId),
            amount: item.relayConfirmed.toString(),
            name: getEvmNetworkName(item.chainId) ?? intl.formatMessage({
                id: 'NA',
            }),
        }))

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
                            {data[index].amount}
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
