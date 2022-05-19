import { makeAutoObservable, runInAction } from 'mobx'

import {
    AllRelayRoundsInfo, AllRelayRoundsInfoRequest, AllRelayRoundsInfoStoreData,
    AllRelayRoundsInfoStoreState,
} from '@/modules/Relayers/types'
import { handleAllRelayRoundsInfo } from '@/modules/Relayers/utils'
import { error, lastOfCalls } from '@/utils'

export class AllRelayRoundsInfoStore {

    protected handleAllRelayRoundsInfo = lastOfCalls(handleAllRelayRoundsInfo)

    protected data: AllRelayRoundsInfoStoreData = {}

    protected state: AllRelayRoundsInfoStoreState = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(params: AllRelayRoundsInfoRequest): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true
        })

        try {
            const result = await this.handleAllRelayRoundsInfo(params)

            if (result) {
                runInAction(() => {
                    this.data.allRelayRoundsInfo = result
                    this.state.isLoading = false
                })
            }
        }
        catch (e) {
            error(e)
            runInAction(() => {
                this.state.isLoading = false
            })
        }
    }

    public get list(): AllRelayRoundsInfo[] | undefined {
        return this.data.allRelayRoundsInfo?.relays
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

    public get totalCount(): number | undefined {
        return this.data.allRelayRoundsInfo?.totalCount
    }

}
