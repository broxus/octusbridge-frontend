import { makeAutoObservable, runInAction } from 'mobx'

import { handleRelaysRoundInfo } from '@/modules/Relayers/utils'
import {
    RelaysRoundInfo, RelaysRoundInfoRequest, RelaysRoundInfoStoreData,
    RelaysRoundInfoStoreState,
} from '@/modules/Relayers/types'
import { error, lastOfCalls } from '@/utils'

export class RelaysRoundInfoStore {

    protected data: RelaysRoundInfoStoreData = {}

    protected state: RelaysRoundInfoStoreState = {}

    protected handleRelaysRoundInfo = lastOfCalls(handleRelaysRoundInfo)

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(params: RelaysRoundInfoRequest): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true
        })

        try {
            const result = await this.handleRelaysRoundInfo(params)

            if (result) {
                runInAction(() => {
                    this.data.relaysRoundInfo = result
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

    public get list(): RelaysRoundInfo[] | undefined {
        return this.data.relaysRoundInfo?.relays
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

    public get totalCount(): number | undefined {
        return this.data.relaysRoundInfo?.totalCount
    }

}
