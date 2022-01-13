import uniqBy from 'lodash.uniqby'
import { Time } from 'lightweight-charts'
import { DateTime } from 'luxon'
import { action, makeAutoObservable } from 'mobx'

import { handleTransfersVolume } from '@/modules/Transfers/utils'
import { TransfersChartStoreData, TransfersChartStoreState, TransfersGraphTimeframe } from '@/modules/Transfers/types'
import { TransfersChartData } from '@/modules/Chart/types'
import { error } from '@/utils'

export class TransfersChartStore {

    protected data: TransfersChartStoreData = {}

    protected state: TransfersChartStoreState = {}

    constructor() {
        makeAutoObservable(this, {
            fetch: action.bound,
            changeTimeframe: action.bound,
        })
    }

    protected setData<K extends keyof TransfersChartStoreData>(key: K, value: TransfersChartStoreData[K]): void {
        this.data[key] = value
    }

    protected setState<K extends keyof TransfersChartStoreState>(key: K, value: TransfersChartStoreState[K]): void {
        this.state[key] = value
    }

    public async fetch(from?: number, to?: number): Promise<void> {
        if (this.state.loading) {
            return
        }

        this.setState('loading', true)

        try {
            const result = await handleTransfersVolume({
                timeframe: this.timeframe,
                from: from || DateTime.local().minus({
                    days: this.timeframe === 'D1' ? 30 : 7,
                }).toUTC(undefined, {
                    keepLocalTime: false,
                }).toMillis(),
                to: to || DateTime.local().toUTC(undefined, {
                    keepLocalTime: false,
                }).toMillis(),
            })

            const data = result.map(item => ({
                timestamp: item.timestamp,
                ethTonVolume: Math.round(parseFloat(item.ethTonVolume)).toString(),
                tonEthVolume: Math.round(parseFloat(item.tonEthVolume)).toString(),
            }))

            this.setData('volumeGraph', data.concat(this.data.volumeGraph || []))
        }
        catch (e) {
            error(e)
        }

        this.setState('loading', false)
    }

    public changeTimeframe(value: TransfersGraphTimeframe): void {
        this.setData('volumeGraph', undefined)
        this.setState('timeframe', value)
    }

    public get chartData(): TransfersChartData {
        return uniqBy(this.data.volumeGraph || [], 'timestamp')
            .sort((a, b) => {
                if (a.timestamp < b.timestamp) {
                    return -1
                }
                if (a.timestamp > b.timestamp) {
                    return 1
                }
                return 0
            })
            .map(item => ({
                time: (item.timestamp / 1000) as Time,
                ethTonValue: parseFloat(item.ethTonVolume),
                tonEthValue: parseFloat(item.tonEthVolume),
            }))
    }

    public get timeframe(): TransfersGraphTimeframe {
        return this.state.timeframe || 'D1'
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

}
