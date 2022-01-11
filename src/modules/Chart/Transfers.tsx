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
    transfersHistogramOptions,
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
    showEvmTon?: boolean;
    showTonEvm?: boolean;
    load: (from?: number, to?: number) => Promise<void>;
}

export function Chart({
    data,
    timeframe,
    showEvmTon = true,
    showTonEvm = true,
    load,
}: Props): JSX.Element {
    const chartRef = React.useRef<HTMLDivElement | null>(null)
    const chart = React.useRef<IChartApi>()

    const [tonEvmSeries, setTonEvmSeries] = React.useState<ISeriesApi<SeriesType>>()
    const [evmTonSeries, setEvmTonSeries] = React.useState<ISeriesApi<SeriesType>>()

    const [evmTonData, tonEvmData] = data
        .reduce<[HistogramData[], HistogramData[]]>((acc, item) => {
            acc[0].push({
                time: item.time,
                value: item.ethTonValue,
            })
            acc[1].push({
                time: item.time,
                value: showEvmTon ? -item.tonEthValue : item.tonEthValue,
            })
            return acc
        }, [[], []])

    const handler = React.useCallback(debounce(async () => {
        const lr = chart.current?.timeScale().getVisibleLogicalRange()

        if (lr) {
            const barsInfo = (evmTonSeries || tonEvmSeries)?.barsInLogicalRange(lr)

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
    }, 50), [chart.current, evmTonSeries, tonEvmSeries, timeframe, load])

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

            chart.current.applyOptions({
                ...histogramOptions,
                ...transfersHistogramOptions,
            })

            setTonEvmSeries(chart.current.addHistogramSeries(tonEthHistogramStyles))
            setEvmTonSeries(chart.current.addHistogramSeries(ethTonHistogramStyles))

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

            evmTonSeries?.setData(evmTonData)
            tonEvmSeries?.setData(tonEvmData)

            evmTonSeries?.applyOptions({ visible: showEvmTon })
            tonEvmSeries?.applyOptions({ visible: showTonEvm })

            listener.current = handler
            chart.current?.timeScale().subscribeVisibleTimeRangeChange(listener.current)
        }
    }, [showEvmTon, showTonEvm, evmTonData, tonEvmData, tonEvmSeries, evmTonSeries, timeframe, handler])

    return (
        <div ref={chartRef} className="chart" />
    )
}
