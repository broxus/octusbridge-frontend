import {
    IReactionDisposer, makeAutoObservable, reaction, runInAction,
} from 'mobx'

import { DaoRootContractAddress } from '@/config'
import { DaoAbi, ProposalConfig } from '@/misc'
import { error } from '@/utils'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'

type Data = {
    config?: ProposalConfig
    threshold?: string
}

export class DaoConfigStore {

    protected data: Data = {}

    protected syncDisposer?: IReactionDisposer

    constructor(
        protected tonWallet: EverWalletService,
    ) {
        makeAutoObservable(this)
    }

    public init(): void {
        if (!this.syncDisposer) {
            this.syncDisposer = reaction(
                () => this.tonWallet.isConnected,
                isConnected => (isConnected ? this.sync() : this.reset()),
                {
                    fireImmediately: true,
                },
            )
        }
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
            const daoContract = rpc.createContract(DaoAbi.Root, DaoRootContractAddress)
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
