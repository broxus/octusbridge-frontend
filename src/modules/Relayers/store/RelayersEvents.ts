import { makeAutoObservable, runInAction } from 'mobx'

import { handleGlobalRelayersEvents, handleRelayersEvents } from '@/modules/Relayers/utils'
import {
    RelayersEvent, RelayersEventsParams, RelayersEventsStoreData,
    RelayersEventsStoreState,
} from '@/modules/Relayers/types'
import { TokensCacheService } from '@/stores/TokensCacheService'
import { error, lastOfCalls } from '@/utils'

export class RelayersEventsStore {

    protected handleRelayersEvents = lastOfCalls(handleRelayersEvents)

    protected handleGlobalRelayersEvents = lastOfCalls(handleGlobalRelayersEvents)

    protected data: RelayersEventsStoreData = {}

    protected state: RelayersEventsStoreState = {}

    constructor(
        protected tokensCache: TokensCacheService,
    ) {
        makeAutoObservable(this)
    }

    public async fetch(params: RelayersEventsParams): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const result = params.relayAddress
                ? await this.handleRelayersEvents(params)
                : await this.handleGlobalRelayersEvents(params)

            if (result?.relays.length) {
                await Promise.allSettled(
                    result.relays.map(item => (
                        this.tokensCache.syncCustomToken(item.tokenAddress)
                    )),
                )
            }

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

    public get isReady(): boolean {
        return this.tokensCache.isReady
    }

    public get items(): RelayersEvent[] | undefined {
        return this.data.relayersEvents?.relays
    }

    public get totalCount(): number | undefined {
        return this.data.relayersEvents?.totalCount
    }

}
