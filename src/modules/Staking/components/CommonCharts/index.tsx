import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { ExplorerChartType } from '@/modules/Staking/types'
import { Timeframe } from '@/modules/Chart/types'
import { ExplorerStoreContext } from '@/modules/Staking/providers/ExplorerStoreProvider'
import { Chart } from '@/modules/Chart'
import { error } from '@/utils'

export function CommonChartsInner(): JSX.Element | null {
    const explorer = React.useContext(ExplorerStoreContext)

    if (!explorer) {
        return null
    }

    const [chartType, setChartType] = React.useState<ExplorerChartType>('TVL')
    const [timeframe, setTimeframe] = React.useState<Timeframe>('H1')

    const load = async (from?: number, to?: number) => {
        if (explorer.chartLoading) {
            return
        }

        try {
            await explorer.fetchChart(chartType, timeframe, from, to)
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        explorer.resetChart()
    }, [
        chartType,
        timeframe,
    ])

    return (
        <ChartLayout<ExplorerChartType>
            types={['TVL']}
            activeType={chartType}
            timeframe={timeframe}
            onChangeTimeframe={setTimeframe}
            onChangeType={setChartType}
            loading={explorer.chartLoading}
        >
            <Chart
                timeframe={timeframe}
                type="Area"
                load={load}
                data={explorer.chartData}
            />
        </ChartLayout>
    )
}

export const CommonCharts = observer(CommonChartsInner)
