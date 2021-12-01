import { makeAutoObservable } from 'mobx'
import { DateTime } from 'luxon'
import { Time } from 'lightweight-charts'
import uniqBy from 'lodash.uniqby'

import {
    handleAprApi, handleMainInfoApi, handleStakeholdersApi, handleTvlApi,
} from '@/modules/Staking/utils'
import {
    ExplorerChartType, ExplorerStoreData, ExplorerStoreState, GraphResponse,
    Stakeholder, StakeholdersApiRequest, StakeholdersApiResponse, StakingMainApiResponse,
} from '@/modules/Staking/types'
import { CommonGraphShape, Timeframe } from '@/modules/Chart/types'
import { error, lastOfCalls } from '@/utils'

export class ExplorerStore {

    protected data: ExplorerStoreData = {}

    protected state: ExplorerStoreState = {}

    protected mainInfoApiHandle: () => Promise<StakingMainApiResponse | undefined>

    protected stakeholdersApiHandle: (params: StakeholdersApiRequest) => Promise<StakeholdersApiResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.mainInfoApiHandle = lastOfCalls(handleMainInfoApi)
        this.stakeholdersApiHandle = lastOfCalls(handleStakeholdersApi)
    }

    public async fetchChart(
        chartType: ExplorerChartType,
        timeframe: Timeframe,
        from?: number,
        to?: number,
    ): Promise<void> {
        if (this.state.chartLoading) {
            return
        }

        this.setChartLoading(true)

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

            this.setChartData(response)
        }
        catch (e) {
            error(e)
        }
        finally {
            this.setChartLoading(false)
        }
    }

    public async fetchStakeholders(params: StakeholdersApiRequest): Promise<void> {
        this.setStakeholdersLoading(true)

        try {
            const data = await handleStakeholdersApi(params)

            if (data) {
                this.setStakeholders(data)
                this.setStakeholdersLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setStakeholdersLoading(false)
        }
    }

    public async fetchMainInfo(): Promise<void> {
        this.setMainInfoLoading(true)

        try {
            const data = await handleMainInfoApi()

            if (data) {
                this.setMainInfo(data)
                this.setMainInfoLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setMainInfoLoading(false)
        }
    }

    protected setMainInfoLoading(value: boolean): void {
        this.state.mainInfoLoading = value
    }

    protected setMainInfo(data: StakingMainApiResponse): void {
        this.data.mainInfo = data
    }

    protected setStakeholdersLoading(value: boolean): void {
        this.state.stakeholdersLoading = value
    }

    protected setStakeholders(data: StakeholdersApiResponse): void {
        this.data.stakeholders = data
    }

    protected setChartLoading(loading: boolean): void {
        this.state.chartLoading = loading
    }

    protected setChartData(data: GraphResponse): void {
        const newItems = data.map(item => ({
            time: (item.timestamp / 1000000) as Time,
            value: parseFloat(item.data),
        }))

        const newChart = this.data.chart
            ? newItems.concat(this.data.chart)
            : newItems

        this.data.chart = uniqBy(newChart, 'time')
    }

    public resetChart(): void {
        this.data.chart = []
    }

    public get tvl(): string | undefined {
        return this.data.mainInfo?.tvl
    }

    public get tvlChange(): string | undefined {
        return this.data.mainInfo?.tvlChange
    }

    public get reward30d(): string | undefined {
        return this.data.mainInfo?.reward30d
    }

    public get reward30dChange(): string | undefined {
        return this.data.mainInfo?.reward30dChange
    }

    public get averageApr(): string | undefined {
        return this.data.mainInfo?.averageApr
    }

    public get stakeholders(): number | undefined {
        return this.data.mainInfo?.stakeholders
    }

    public get chartData(): CommonGraphShape[] {
        return this.data.chart ? [...this.data.chart] : []
    }

    public get stakeholderTotalCount(): number | undefined {
        return this.data.stakeholders?.totalCount
    }

    public get stakeholdersItems(): Stakeholder[] {
        return this.data.stakeholders?.stakeholders
            ? [...this.data.stakeholders.stakeholders]
            : []
    }

    public get chartLoading(): boolean {
        return Boolean(this.state.chartLoading)
    }

    public get stakeholdersLoading(): boolean {
        return Boolean(this.state.stakeholdersLoading)
    }

}
