import * as React from 'react'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'

import { calcChartArc } from '@/components/common/PieChart/arc'

import './index.scss'

type Arc = {
    d: string;
    d2: string;
    percent: number;
}

type Item = {
    value: string;
    color: string;
}

type Props = {
    data: Item[];
    radius: number;
    innerRadius: number;
    onMouseOut?: () => void;
    onMouseOver?: (index: number, percent: number) => void;
    onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
}

export function Chart({
    data,
    radius,
    innerRadius,
    onMouseOut,
    onMouseOver,
    onMouseMove,
}: Props): JSX.Element {
    const [activeIndex, setActiveIndex] = React.useState<number>()
    const size = radius * 2
    const total = data.reduce((acc, item) => acc.plus(item.value), new BigNumber(0))
        .toFixed()

    const arcs: Arc[] = []
    let offset = 0

    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const percent = new BigNumber(item.value).gt(0)
            ? new BigNumber(item.value)
                .times(100)
                .dividedBy(total)
                .decimalPlaces(2)
                .toNumber()
            : 0
        const pie = (percent * (data.length > 1 ? 360 : 359.99)) / 100
        const d = calcChartArc(offset, offset + pie, radius, innerRadius)
        const d2 = calcChartArc(offset, offset + pie, radius - 25, innerRadius)

        offset += pie
        arcs.push({ d, d2, percent })
    }

    const mouseOverFn = (index: number) => () => {
        onMouseOver?.(index, arcs[index].percent)
        setActiveIndex(index)
    }

    const mouseOut = () => {
        setActiveIndex(undefined)
        onMouseOut?.()
    }

    return (
        <svg width={size} height={size}>
            {arcs.map(({ d, d2 }, index) => (
                /* eslint-disable react/no-array-index-key */
                <React.Fragment key={index}>
                    <path
                        d={d}
                        fill={data[index].color}
                        className={classNames('pie-chart-hover', {
                            'pie-chart-hover_active': activeIndex === index,
                        })}
                    />
                    <path
                        d={d2}
                        fill={data[index].color}
                        onMouseOver={mouseOverFn(index)}
                        onMouseOut={mouseOut}
                        onMouseMove={onMouseMove}
                        style={{ transform: 'translate(25px, 25px)' }}
                    />
                </React.Fragment>
            ))}
        </svg>
    )
}
