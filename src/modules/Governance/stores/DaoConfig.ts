import { Contract } from 'everscale-inpage-provider'
import {
    IReactionDisposer, makeAutoObservable, reaction, runInAction,
} from 'mobx'

import { TonWalletService } from '@/stores/TonWalletService'
import { DaoRootContractAddress } from '@/config'
import { DaoAbi, ProposalConfig } from '@/misc'
import { error } from '@/utils'

type Data = {
    config?: ProposalConfig
    threshold?: string
}

export class DaoConfigStore {

    protected data: Data = {}

    protected syncDisposer?: IReactionDisposer

    constructor(
        protected tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this)
    }

    public init(): void {
        this.syncDisposer = reaction(
            () => this.tonWallet.isConnected,
            isConnected => (isConnected ? this.sync() : this.reset()),
            {
                fireImmediately: true,
            },
        )
    }

    public dispose(): void {
        this.syncDisposer?.()
        this.reset()
    }

    public reset(): void {
        this.data = {}
    }

    public async sync(): Promise<void> {
        try {
            const daoContract = new Contract(DaoAbi.Root, DaoRootContractAddress)
            const result = await daoContract.methods.proposalConfiguration({}).call()
            runInAction(() => {
                this.data.config = result.proposalConfiguration
            })
        }
        catch (e) {
            error(e)
        }
    }

    public get threshold(): string | undefined {
        return this.data?.config?.threshold
    }

}
