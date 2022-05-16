import { makeAutoObservable, runInAction } from 'mobx'

import { RelayersEvent, TransferEventStoreData, TransferEventStoreState } from '@/modules/Relayers/types'
import { handleRelayersEvents } from '@/modules/Relayers/utils'
import { error } from '@/utils'

export class TransferEventStore {

    protected data: TransferEventStoreData = {}

    protected state: TransferEventStoreState = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(contractAddress: string): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const result = await handleRelayersEvents({
                limit: 1,
                offset: 0,
                contractAddress,
                ordering: 'timestampdescending',
            })

            runInAction(() => {
                [this.data.event] = result.relays
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

    public get event(): RelayersEvent | undefined {
        return this.data.event
    }

    public get isLoading(): boolean | undefined {
        return this.state.isLoading
    }

}
