import { Address, Contract } from 'ton-inpage-provider'
import { makeAutoObservable } from 'mobx'

import { ConfigStoreData, ConfigStoreState } from '@/modules/Governance/types'
import { ProposalAbi, ProposalConfig } from '@/misc'
import { error } from '@/utils'

export class ProposalConfigStore {

    protected data: ConfigStoreData = {}

    protected state: ConfigStoreState = {
        loading: false,
    }

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(address: string): Promise<void> {
        if (this.state.loading) {
            return
        }

        this.setLoading(true)

        try {
            const proposalContract = new Contract(ProposalAbi.Root, new Address(address))

            const { value0: config } = await proposalContract.methods.getConfig({
                answerId: 0,
            }).call()

            this.setConfig(config)
        }
        catch (e) {
            error(e)
        }

        this.setLoading(false)
    }

    protected setConfig(config: ProposalConfig): void {
        this.data.config = config
    }

    protected setLoading(loading: boolean): void {
        this.state.loading = loading
    }

    public get loading(): boolean {
        return this.state.loading
    }

    public get gracePeriod(): number | undefined {
        if (!this.data.config?.gracePeriod) {
            return undefined
        }

        const value = parseInt(this.data.config?.gracePeriod, 10)
        return !Number.isNaN(value) ? value : undefined
    }

    public get votingDelay(): number | undefined {
        if (!this.data.config?.votingDelay) {
            return undefined
        }

        const value = parseInt(this.data.config?.votingDelay, 10)
        return !Number.isNaN(value) ? value * 1000 : undefined
    }

    public get timeLock(): number | undefined {
        if (!this.data.config?.timeLock) {
            return undefined
        }

        const value = parseInt(this.data.config?.timeLock, 10)
        return !Number.isNaN(value) ? value * 1000 : undefined
    }

    public get votingPeriod(): number | undefined {
        if (!this.data.config?.votingPeriod) {
            return undefined
        }

        const value = parseInt(this.data.config?.votingPeriod, 10)
        return !Number.isNaN(value) ? value * 1000 : undefined
    }

}
