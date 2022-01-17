import { makeAutoObservable } from 'mobx'
import { DateTime } from 'luxon'
import { Time } from 'lightweight-charts'
import uniqBy from 'lodash.uniqby'

import { handleAprApi, handleTvlApi } from '@/modules/Staking/utils'
import {
    ChartStoreData, ChartStoreState, ExplorerChartType, GraphResponse,
} from '@/modules/Staking/types'
import { CommonGraphShape, Timeframe } from '@/modules/Chart/types'
import { error } from '@/utils'

export class ChartStore {

    protected data: ChartStoreData = {}

    protected state: ChartStoreState = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(
        chartType: ExplorerChartType,
        timeframe: Timeframe,
        from?: number,
        to?: number,
    ): Promise<void> {
        if (this.state.isLoading) {
            return
        }

        this.setLoading(true)

        try {
            const params = {
                timeframe,
                to: to || new Date().getTime(),
                from: from || DateTime.local().minus({
                    days: timeframe === 'D1' ? 30 : 7,
                }).toUTC(undefined, {
                    keepLocalTime: false,
                }).toMillis(),
            }

            const response = chartType === 'TVL'
                ? await handleTvlApi(params)
                : await handleAprApi(params)

            this.setData(response)
        }
        catch (e) {
            error(e)
        }

        this.setLoading(false)
    }

    protected setLoading(loading: boolean): void {
        this.state.isLoading = loading
    }

    protected setData(data: GraphResponse): void {
        const newItems = data.map(item => ({
            time: (item.timestamp / 1000000) as Time,
            value: parseFloat(item.data),
        }))

        const newChart = this.data.chart
            ? newItems.concat(this.data.chart)
            : newItems

        this.data.chart = uniqBy(newChart, 'time')
    }

    public reset(): void {
        this.data.chart = []
    }

    public get chartData(): CommonGraphShape[] {
        return this.data.chart ? [...this.data.chart] : []
    }

    public get isLoading(): boolean {
        return Boolean(this.state.isLoading)
    }

}
