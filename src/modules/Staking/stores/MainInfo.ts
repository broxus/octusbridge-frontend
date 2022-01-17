import { makeAutoObservable, runInAction } from 'mobx'

import { handleMainInfoApi } from '@/modules/Staking/utils'
import { MainInfoData, MainInfoState } from '@/modules/Staking/types'
import { error } from '@/utils'

export class MainInfoStore {

    protected data: MainInfoData = {}

    protected state: MainInfoState = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true
        })

        try {
            const mainInfo = await handleMainInfoApi()

            runInAction(() => {
                this.data.mainInfo = mainInfo
            })
        }
        catch (e) {
            error(e)
        }

        runInAction(() => {
            this.state.isLoading = false
        })
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

}
