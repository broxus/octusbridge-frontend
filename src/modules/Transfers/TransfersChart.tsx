import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Checkbox } from '@/components/common/Checkbox'
import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { Chart } from '@/modules/Chart/Transfers'
import { useTransfersChart } from '@/modules/Transfers/hooks'

import './index.scss'

export function TransfersChartInner(): JSX.Element {
    const intl = useIntl()
    const transfersChart = useTransfersChart()
    const [showEvmTon, setShowEvmTon] = React.useState(true)
    const [showTonEvm, setShowTonEvm] = React.useState(true)

    return (
        <ChartLayout
            loading={transfersChart.loading}
            timeframe={transfersChart.timeframe}
            onChangeTimeframe={transfersChart.changeTimeframe}
            showNoData={!transfersChart.loading && transfersChart.chartData.length === 0}
        >
            <Chart
                timeframe={transfersChart.timeframe}
                data={transfersChart.chartData}
                load={transfersChart.fetch}
                showEvmTon={showEvmTon}
                showTonEvm={showTonEvm}
            />

            <div className="transfers-chart-toggler">
                <Checkbox
                    color="rgba(74, 180, 74, 1)"
                    checked={showEvmTon}
                    onChange={setShowEvmTon}
                    label={intl.formatMessage({
                        id: 'TRANSFERS_CHART_EVM_EVER',
                    })}
                />

                <Checkbox
                    color="rgba(235, 67, 97, 1)"
                    checked={showTonEvm}
                    onChange={setShowTonEvm}
                    label={intl.formatMessage({
                        id: 'TRANSFERS_CHART_EVER_EVM',
                    })}
                />
            </div>
        </ChartLayout>
    )
}

export const TransfersChart = observer(TransfersChartInner)
