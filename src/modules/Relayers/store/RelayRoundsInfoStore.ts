import { makeAutoObservable, runInAction } from 'mobx'

import {
    RelayRoundsInfo, RelayRoundsInfoRequest, RelayRoundsInfoStoreData, RelayRoundsInfoStoreState,
} from '@/modules/Relayers/types'
import { handleRelayRoundsInfo } from '@/modules/Relayers/utils'
import { error, lastOfCalls } from '@/utils'

export class RelayRoundsInfoStore {

    protected data: RelayRoundsInfoStoreData = {}

    protected state: RelayRoundsInfoStoreState = {}

    handleRelayRoundsInfo = lastOfCalls(handleRelayRoundsInfo)

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(params: RelayRoundsInfoRequest): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true
        })
        try {
            const result = await this.handleRelayRoundsInfo(params)

            if (result) {
                runInAction(() => {
                    this.data.relayRoundsInfo = result
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

    public get list(): RelayRoundsInfo[] | undefined {
        return this.data.relayRoundsInfo?.relays
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

    public get totalCount(): number | undefined {
        return this.data.relayRoundsInfo?.totalCount
    }

}
