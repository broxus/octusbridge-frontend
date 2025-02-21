import {
    type IReactionDisposer, makeAutoObservable, runInAction, toJS,
} from 'mobx'

import { StakingAccountAddress } from '@/config'
import { staticRpc } from '@/hooks/useStaticRpc'
import { type RelayConfig, StackingAbi } from '@/misc'
import { type RelayersDataStoreData } from '@/modules/Relayers/types'
import { error } from '@/utils'

export class RelayersDataStore {

    protected syncDisposer?: IReactionDisposer

    protected data: RelayersDataStoreData = {}

    protected stakingContract = staticRpc.createContract(
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
