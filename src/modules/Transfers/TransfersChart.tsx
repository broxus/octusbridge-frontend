import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { Chart } from '@/modules/Chart/Transfers'
import { useTransfersChart } from '@/modules/Transfers/hooks'

export function TransfersChart(): JSX.Element {
    const intl = useIntl()
    const transfersChart = useTransfersChart()

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'TRANSFERS_CHART_TITLE',
                })}
            </Title>

            <Observer>
                {() => (
                    <ChartLayout
                        loading={transfersChart.loading}
                        timeframe={transfersChart.timeframe}
                        onChangeTimeframe={transfersChart.changeTimeframe}
                        showNoData={!transfersChart.loading && transfersChart.chartData.length === 0}
                    >
                        <Chart
                            data={transfersChart.chartData}
                            timeframe={transfersChart.timeframe}
                            load={transfersChart.fetch}
                        />
                    </ChartLayout>
                )}
            </Observer>
        </Section>
    )
}
