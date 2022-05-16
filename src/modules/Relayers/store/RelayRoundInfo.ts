import { makeAutoObservable, runInAction } from 'mobx'

import { handleRelayRoundInfo } from '@/modules/Relayers/utils'
import {
    RelayRoundInfoParams, RelayRoundInfoResponse, RelayRoundInfoStoreData, RelayRoundInfoStoreState,
} from '@/modules/Relayers/types'
import { error } from '@/utils'

export class RelayRoundInfoStore {

    protected state: RelayRoundInfoStoreState = {}

    protected data: RelayRoundInfoStoreData = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(params: RelayRoundInfoParams): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const relayRoundInfo = await handleRelayRoundInfo(params)

            runInAction(() => {
                this.data.relayRoundInfo = relayRoundInfo
            })
        }
        catch (e) {
            error(e)
        }
        finally {
            runInAction(() => {
                this.state.isLoading = false
            })
        }
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

    public get info(): RelayRoundInfoResponse | undefined {
        return this.data.relayRoundInfo
    }

}
