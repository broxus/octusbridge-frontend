import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { Tab, Tabs } from '@/components/common/Tabs'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Timeframe } from '@/modules/Chart/types'

import './index.scss'

type ChartType = {
    id: string;
    label: string;
}

type Props = {
    chartTypes?: ChartType[];
    chartTypeId?: string;
    timeframe?: Timeframe;
    loading?: boolean;
    showNoData?: boolean;
    showSoon?: boolean;
    children?: React.ReactNode;
    onChangeType?: (chartTypeId: string) => void;
    onChangeTimeframe?: (timeframe: Timeframe) => void;
}

export function ChartLayout({
    chartTypes = [],
    chartTypeId,
    timeframe = 'H1',
    loading,
    showNoData,
    showSoon,
    children,
    onChangeType,
    onChangeTimeframe,
}: Props): JSX.Element {
    const intl = useIntl()

    const clickTabFn = (value: ChartType) => () => {
        onChangeType?.(value.id)
    }

    const clickScaleFn = (value: Timeframe) => () => {
        onChangeTimeframe?.(value)
    }

    return (
        <div className="card card--flat card--small chart-layout">
            <div className="chart-layout__head">
                <Tabs>
                    {chartTypes.map(chartType => (
                        <Tab
                            key={chartType.id}
                            active={chartTypeId === chartType.id}
                            onClick={clickTabFn(chartType)}
                        >
                            {chartType.label}
                        </Tab>
                    ))}
                </Tabs>

                <Tabs theme="fill">
                    <Tab
                        active={timeframe === 'H1'}
                        onClick={clickScaleFn('H1')}
                    >
                        {intl.formatMessage({
                            id: 'CHART_LAYOUT_HOURS',
                        })}
                    </Tab>
                    <Tab
                        active={timeframe === 'D1'}
                        onClick={clickScaleFn('D1')}
                    >
                        {intl.formatMessage({
                            id: 'CHART_LAYOUT_DAY',
                        })}
                    </Tab>
                </Tabs>
            </div>

            {showNoData && (
                <div className="chart-layout__message">
                    {intl.formatMessage({
                        id: 'CHART_LAYOUT_NO_DATA',
                    })}
                </div>
            )}

            {showSoon && (
                <div className="chart-layout__message">
                    {intl.formatMessage({
                        id: 'SOON',
                    })}
                </div>
            )}

            <div className="chart-layout__chart">
                {children}
            </div>

            <div
                className={classNames('chart-layout__spinner', {
                    'chart-layout__spinner_visible': loading,
                })}
            >
                <ContentLoader transparent slim />
            </div>
        </div>
    )
}
