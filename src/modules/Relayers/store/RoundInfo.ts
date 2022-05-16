import { makeAutoObservable, runInAction } from 'mobx'

import { handleRoundInfo } from '@/modules/Relayers/utils'
import {
    RoundInfoParams, RoundInfoResponse, RoundInfoStoreData, RoundInfoStoreState,
} from '@/modules/Relayers/types'
import { error, lastOfCalls } from '@/utils'

export class RoundInfoStore {

    protected state: RoundInfoStoreState = {}

    protected data: RoundInfoStoreData = {}

    protected handleRoundInfo: (params: RoundInfoParams) => Promise<RoundInfoResponse | undefined>

    constructor() {
        this.handleRoundInfo = lastOfCalls(handleRoundInfo)

        makeAutoObservable(this)
    }

    public async fetch(params: RoundInfoParams): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const roundInfo = await this.handleRoundInfo(params)

            if (roundInfo) {
                runInAction(() => {
                    this.state.isLoading = false
                    this.data.roundInfo = roundInfo
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

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

    public get info(): RoundInfoResponse | undefined {
        return this.data.roundInfo
    }

}
