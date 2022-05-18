import { makeAutoObservable, runInAction } from 'mobx'

import { RelayersEvent, TransferEventStoreData, TransferEventStoreState } from '@/modules/Relayers/types'
import { handleRelayersEvents } from '@/modules/Relayers/utils'
import { TokensCacheService } from '@/stores/TokensCacheService'
import { error } from '@/utils'

export class TransferEventStore {

    protected data: TransferEventStoreData = {}

    protected state: TransferEventStoreState = {}

    constructor(
        protected tokensCache: TokensCacheService,
    ) {
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
                transferContractAddress: contractAddress,
                ordering: 'timestampdescending',
            })

            if (result.relays.length) {
                await this.tokensCache.syncCustomToken(result.relays[0].tokenAddress)
            }

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

    public get isReady(): boolean {
        return this.tokensCache.isReady
    }

}
