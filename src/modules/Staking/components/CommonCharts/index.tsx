import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { Timeframe } from '@/modules/Chart/types'
import { useExplorerContext } from '@/modules/Staking/providers/ExplorerProvider'
import { Chart } from '@/modules/Chart'
import { error } from '@/utils'

export function CommonChartsInner(): JSX.Element | null {
    const { chart } = useExplorerContext()
    const [timeframe, setTimeframe] = React.useState<Timeframe>('H1')

    const load = async (from?: number, to?: number) => {
        if (chart.isLoading) {
            return
        }

        try {
            await chart.fetch('TVL', timeframe, from, to)
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        chart.reset()
    }, [
        timeframe,
    ])

    return (
        <ChartLayout
            chartTypes={[{
                id: 'TVL',
                label: 'TVL',
            }]}
            chartTypeId="TVL"
            timeframe={timeframe}
            onChangeTimeframe={setTimeframe}
            loading={chart.isLoading}
        >
            <Chart
                timeframe={timeframe}
                type="Area"
                load={load}
                data={chart.chartData}
            />
        </ChartLayout>
    )
}

export const CommonCharts = observer(CommonChartsInner)
