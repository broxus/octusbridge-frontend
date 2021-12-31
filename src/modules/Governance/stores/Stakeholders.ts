import { makeAutoObservable } from 'mobx'

import {
    Stakeholder, StakeholdersRequest, StakeholdersResponse,
    StakeholdersStoreData, StakeholdersStoreState,
} from '@/modules/Governance/types'
import { handleStakeholders } from '@/modules/Governance/utils'
import { error, lastOfCalls } from '@/utils'

export class StakeholdersStore {

    protected data: StakeholdersStoreData = {}

    protected state: StakeholdersStoreState = {}

    protected handleStakeholders: (params: StakeholdersRequest) => Promise<StakeholdersResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleStakeholders = lastOfCalls(handleStakeholders)
    }

    public async fetch(params: StakeholdersRequest): Promise<void> {
        this.setLoading(true)

        try {
            const response = await this.handleStakeholders(params)
            if (response) {
                this.setResponse(response)
                this.setLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setLoading(false)
        }
    }

    protected setLoading(loading: boolean): void {
        this.state.loading = loading
    }

    protected setResponse(response: StakeholdersResponse): void {
        this.data.response = response
    }

    public get totalCount(): number {
        return this.data.response?.totalCount || 1
    }

    public get items(): Stakeholder[] {
        return this.data.response?.stakeholders || []
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

}
