import { makeAutoObservable, runInAction } from 'mobx'

import { handleRelayersEvents } from '@/modules/Relayers/utils'
import {
    RelayersEvent, RelayersEventsParams, RelayersEventsStoreData,
    RelayersEventsStoreState,
} from '@/modules/Relayers/types'
import { error, lastOfCalls } from '@/utils'

export class RelayersEventsStore {

    protected handleRelayersEvents = lastOfCalls(handleRelayersEvents)

    protected data: RelayersEventsStoreData = {}

    protected state: RelayersEventsStoreState = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(params: RelayersEventsParams): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const result = await this.handleRelayersEvents(params)

            if (result) {
                runInAction(() => {
                    this.state.isLoading = false
                    this.data.relayersEvents = result
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

    public get items(): RelayersEvent[] | undefined {
        return this.data.relayersEvents?.relays
    }

    public get totalCount(): number | undefined {
        return this.data.relayersEvents?.totalCount
    }

}
