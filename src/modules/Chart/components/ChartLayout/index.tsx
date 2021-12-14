import * as React from 'react'
import classNames from 'classnames'

import { Tab, Tabs } from '@/components/common/Tabs'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Timeframe } from '@/modules/Chart/types'

import './index.scss'

type Props<T> = {
    types?: T[];
    activeType?: T;
    timeframe?: Timeframe;
    onChangeType?: (type: T) => void;
    onChangeTimeframe?: (timeframe: Timeframe) => void;
    loading?: boolean;
    children?: React.ReactNode;
}

export function ChartLayout<T extends string>({
    types = [],
    activeType,
    timeframe = 'H1',
    onChangeType,
    onChangeTimeframe,
    loading,
    children,
}: Props<T>): JSX.Element {
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
                        H
                    </Tab>
                    <Tab
                        active={timeframe === 'D1'}
                        onClick={clickScaleFn('D1')}
                    >
                        D
                    </Tab>
                </Tabs>
            </div>

            <div className="chart-layout__chart">
                {children}
            </div>

            <div
                className={classNames('chart-layout__spinner', {
                    'chart-layout__spinner_visible': loading,
                })}
            >
                <ContentLoader slim />
            </div>
        </div>
    )
}
