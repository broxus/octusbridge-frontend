import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Checkbox } from '@/components/common/Checkbox'
import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { Chart } from '@/modules/Chart/Transfers'
import { useTransfersStatsContext } from '@/modules/Transfers/providers'

import './index.scss'

export function TransfersChartInner(): JSX.Element {
    const intl = useIntl()
    const { chart } = useTransfersStatsContext()
    const [showEvmTon, setShowEvmTon] = React.useState(true)
    const [showTonEvm, setShowTonEvm] = React.useState(true)

    return (
        <ChartLayout
            loading={chart.loading}
            timeframe={chart.timeframe}
            onChangeTimeframe={chart.changeTimeframe}
            showNoData={!chart.loading && chart.chartData.length === 0}
        >
            <Chart
                timeframe={chart.timeframe}
                data={chart.chartData}
                load={chart.fetch}
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
