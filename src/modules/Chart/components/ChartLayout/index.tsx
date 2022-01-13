import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { Tab, Tabs } from '@/components/common/Tabs'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Timeframe } from '@/modules/Chart/types'

import './index.scss'

type Props<T> = {
    types?: T[];
    activeType?: T;
    timeframe?: Timeframe;
    loading?: boolean;
    showNoData?: boolean;
    children?: React.ReactNode;
    onChangeType?: (type: T) => void;
    onChangeTimeframe?: (timeframe: Timeframe) => void;
}

export function ChartLayout<T extends string>({
    types = [],
    timeframe = 'H1',
    activeType,
    loading,
    showNoData,
    children,
    onChangeType,
    onChangeTimeframe,
}: Props<T>): JSX.Element {
    const intl = useIntl()

    const clickTabFn = (value: T) => () => {
        onChangeType?.(value)
    }

    const clickScaleFn = (value: Timeframe) => () => {
        onChangeTimeframe?.(value)
    }

    return (
        <div className="card card--flat card--small chart-layout">
            <div className="chart-layout__head">
                <Tabs>
                    {types.map(chartType => (
                        <Tab
                            key={chartType}
                            active={activeType === chartType}
                            onClick={clickTabFn(chartType)}
                        >
                            {chartType}
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
                <div className="chart-layout__no-data">
                    {intl.formatMessage({
                        id: 'CHART_LAYOUT_NO_DATA',
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
