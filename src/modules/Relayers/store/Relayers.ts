import { makeAutoObservable, runInAction } from 'mobx'

import { error, lastOfCalls } from '@/utils'
import { handleRelayers } from '@/modules/Relayers/utils'
import {
    RelayersSearchParams, RelayersSearchResponse, RelayersStoreData, RelayersStoreState,
} from '@/modules/Relayers/types'

export class RelayersStore {

    protected state: RelayersStoreState = {}

    protected data: RelayersStoreData = {}

    handleRelayers = lastOfCalls(handleRelayers)

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(params: RelayersSearchParams): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const relayers = await this.handleRelayers(params)

            if (relayers) {
                runInAction(() => {
                    this.data.relayers = relayers
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

    public get relayers(): RelayersSearchResponse['relays'] {
        return this.data.relayers?.relays || []
    }

    public get totalCount(): RelayersSearchResponse['totalCount'] | undefined {
        return this.data.relayers?.totalCount
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

}
