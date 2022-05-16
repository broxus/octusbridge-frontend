import { makeAutoObservable, runInAction, toJS } from 'mobx'

import { handleRelayInfo } from '@/modules/Relayers/utils'
import {
    RelayInfoParams, RelayInfoResponse, RelayInfoStoreData, RelayInfoStoreState,
} from '@/modules/Relayers/types'
import { error } from '@/utils'

export class RelayInfoStore {

    protected state: RelayInfoStoreState = {}

    protected data: RelayInfoStoreData = {}

    constructor(
    ) {
        makeAutoObservable(this)
    }

    public async fetch(params: RelayInfoParams): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const [result] = await Promise.all([
                handleRelayInfo(params),
            ])

            runInAction(() => {
                this.data.relayInfo = result
                this.data.address = params.relayAddress
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

    public get isLoading(): boolean | undefined {
        return this.state.isLoading
    }

    public get relayInfo(): RelayInfoResponse | undefined {
        return toJS(this.data.relayInfo)
    }

    public get address(): string | undefined {
        return this.data.address
    }

}
