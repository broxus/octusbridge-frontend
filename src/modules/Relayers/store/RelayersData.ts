import {
    IReactionDisposer, makeAutoObservable, runInAction, toJS,
} from 'mobx'

import { StakingAccountAddress } from '@/config'
import { RelayersDataStoreData } from '@/modules/Relayers/types'
import { RelayConfig, StackingAbi } from '@/misc'
import { error } from '@/utils'
import rpc from '@/hooks/useRpcClient'


export class RelayersDataStore {

    protected syncDisposer?: IReactionDisposer

    protected data: RelayersDataStoreData = {}

    protected stakingContract = rpc.createContract(
        StackingAbi.Root,
        StakingAccountAddress,
    )

    constructor() {
        makeAutoObservable(this)
    }

    public async fetchRelayConfig(): Promise<void> {
        if (this.data.relayConfig) {
            return
        }

        try {
            const { value0: result } = await this.stakingContract.methods.getRelayConfig({
                answerId: 0,
            }).call()

            runInAction(() => {
                this.data.relayConfig = result
            })
        }
        catch (e) {
            error(e)
        }
    }

    public get relayConfig(): RelayConfig | undefined {
        return toJS(this.data.relayConfig)
    }

}
