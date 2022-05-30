import * as React from 'react'
import BigNumber from 'bignumber.js'

import { Tooltip } from '@/components/common/PieChart/tooltip'
import { Chart } from '@/components/common/PieChart/chart'
import { useDebounce } from '@/hooks/useDebounce'

import './index.scss'

type Item = {
    value: string;
    color: string;
}

type Props = {
    data: Item[];
    radius?: number;
    innerRadius?: number;
    renderTooltip: (index: number, percent: number) => React.ReactNode;
}

export function PieChart({
    data,
    radius = 140,
    innerRadius = 68,
    renderTooltip,
}: Props): JSX.Element {
    const [tooltipVisible, setTooltipVisible] = React.useState(false)
    const [tooltipPosition, setTooltipPosition] = React.useState([0, 0])
    const [tooltipContent, setTooltipContent] = React.useState<React.ReactNode>()
    const _tooltipVisible = useDebounce(tooltipVisible, 50)

    const onMouseOver = (index: number, percent: number) => {
        setTooltipVisible(true)
        setTooltipContent(renderTooltip(index, percent))
    }

    const onMouseOut = () => {
        setTooltipVisible(false)
    }

    const onMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
        setTooltipPosition([e.clientX, e.clientY])
    }

    const hasData = data.some(item => !new BigNumber(item.value).isZero())

    return (
        <>
            {hasData ? (
                <>
                    <Chart
                        data={data}
                        radius={radius}
                        innerRadius={innerRadius}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        onMouseMove={onMouseMove}
                    />
                    {_tooltipVisible && (
                        <Tooltip
                            left={tooltipPosition[0]}
                            top={tooltipPosition[1]}
                        >
                            {tooltipContent}
                        </Tooltip>
                    )}
                </>
            ) : (
                <Chart
                    data={[{
                        color: 'rgba(255, 255, 255, 0.12)',
                        value: '1',
                    }]}
                    radius={radius}
                    innerRadius={innerRadius}
                />
            )}
        </>
    )
}
