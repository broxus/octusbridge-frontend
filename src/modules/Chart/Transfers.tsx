import * as React from 'react'
import {
    createChart,
    HistogramData,
    IChartApi,
    ISeriesApi,
    SeriesType,
} from 'lightweight-charts'

import {
    chartOptions,
    ethTonHistogramStyles,
    histogramOptions,
    tonEthHistogramStyles,
} from '@/modules/Chart/styles'
import {
    Timeframe,
    TransfersChartData,
} from '@/modules/Chart/types'
import { debounce } from '@/utils'

import './index.scss'

type Props = {
    data: TransfersChartData;
    timeframe: Timeframe;
    load: (from?: number, to?: number) => Promise<void>;
}

export function Chart({
    timeframe,
    data,
    load,
}: Props): JSX.Element {
    const chartRef = React.useRef<HTMLDivElement | null>(null)
    const chart = React.useRef<IChartApi>()

    const [ethTonSeries, setEthTonSeries] = React.useState<ISeriesApi<SeriesType>>()
    const [tonEthSeries, setTonEthSeries] = React.useState<ISeriesApi<SeriesType>>()

    const [tonEthData, ethTonData] = data
        .reduce<[HistogramData[], HistogramData[]]>((acc, item) => {
            acc[0].push({
                time: item.time,
                value: item.tonEthValue,
            })
            acc[1].push({
                time: item.time,
                value: item.ethTonValue,
            })
            return acc
        }, [[], []])

    const handler = React.useCallback(debounce(async () => {
        const lr = chart.current?.timeScale().getVisibleLogicalRange()

        if (lr) {
            const barsInfo = ethTonSeries?.barsInLogicalRange(lr)

            if (
                barsInfo?.barsBefore !== undefined
                && barsInfo.barsBefore < 0
                && barsInfo?.from !== undefined
                && typeof barsInfo.from === 'number'
            ) {
                const tf = timeframe === 'D1' ? 86400 : 3600
                const newFrom = barsInfo?.from * 1000 + Math.ceil(barsInfo?.barsBefore) * tf * 1000
                const newTo = barsInfo?.from * 1000

                await load?.(
                    newFrom,
                    newTo,
                )
            }
        }
    }, 50), [chart.current, ethTonSeries, timeframe, load])

    const listener = React.useRef<typeof handler>()

    const handleResize = React.useCallback(() => {
        if (chart.current && chartRef.current) {
            chart.current.resize(
                chartRef.current.clientWidth,
                chartRef.current.clientHeight,
                true,
            )
        }
    }, [chart.current])

    React.useEffect(() => {
        window.addEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('orientationchange', handleResize)
        }
    }, [])

    React.useEffect(() => {
        if (chartRef.current && !chart.current) {
            chart.current = createChart(chartRef.current, {
                height: chartRef.current.clientHeight,
                width: chartRef.current.clientWidth,
                ...chartOptions,
            })

            chart.current.applyOptions(histogramOptions)

            setEthTonSeries(chart.current.addHistogramSeries(ethTonHistogramStyles))
            setTonEthSeries(chart.current.addHistogramSeries(tonEthHistogramStyles))

            chart.current.timeScale().resetTimeScale()
            chart.current.timeScale().fitContent()
        }
    }, [chartRef.current])

    React.useEffect(() => {
        if (data.length === 0) {
            (async () => {
                await load?.()
                chart.current?.timeScale().resetTimeScale()
                chart.current?.timeScale().fitContent()
            })()
        }
    }, [data])

    React.useEffect(() => {
        if (chart.current) {
            if (listener.current !== undefined) {
                chart.current?.timeScale().unsubscribeVisibleTimeRangeChange(listener.current)
                listener.current = undefined
            }

            tonEthSeries?.setData(tonEthData)
            ethTonSeries?.setData(ethTonData)

            listener.current = handler
            chart.current?.timeScale().subscribeVisibleTimeRangeChange(listener.current)
        }
    }, [data, tonEthSeries, ethTonSeries, timeframe, handler])

    React.useEffect(() => {
        tonEthSeries?.setData(tonEthData)
        ethTonSeries?.setData(ethTonData)
    }, [data])

    return <div ref={chartRef} className="chart" />
}
