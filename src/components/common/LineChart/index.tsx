import * as React from 'react'

import { Tab, Tabs } from '@/components/common/Tabs'

import './index.scss'

type ScaleType = '1H' | '1D'

type Props = {
    types?: string[];
    activeTypeIndex?: number;
    scaleType?: ScaleType;
    onChangeType?: (index: number) => void;
    onChangeScale?: (type: string) => void;
}

export function LineChart({
    types = [],
    activeTypeIndex = 0,
    scaleType = '1H',
    onChangeType,
    onChangeScale,
}: Props): JSX.Element {
    const clickTabFn = (index: number) => () => {
        onChangeType?.(index)
    }

    const clickScaleFn = (type: ScaleType) => () => {
        onChangeScale?.(type)
    }

    return (
        <div className="card card--flat card--small line-charts">
            <div className="line-charts__head">
                <Tabs>
                    {types.map((chartType, index) => (
                        <Tab
                            key={chartType}
                            active={activeTypeIndex === index}
                            onClick={clickTabFn(index)}
                        >
                            {chartType}
                        </Tab>
                    ))}
                </Tabs>

                <Tabs theme="fill">
                    <Tab
                        active={scaleType === '1H'}
                        onClick={clickScaleFn('1H')}
                    >
                        1H
                    </Tab>
                    <Tab
                        active={scaleType === '1D'}
                        onClick={clickScaleFn('1D')}
                    >
                        1D
                    </Tab>
                </Tabs>
            </div>

            <div className="line-charts__chart">

            </div>
        </div>
    )
}
