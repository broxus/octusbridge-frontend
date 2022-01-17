import { makeAutoObservable } from 'mobx'

import { handleStakeholdersApi } from '@/modules/Staking/utils'
import {
    Stakeholder, StakeholdersApiRequest, StakeholdersApiResponse,
    StakeholdersStoreData, StakeholdersStoreState,
} from '@/modules/Staking/types'
import { error, lastOfCalls } from '@/utils'

export class StakeholdersStore {

    protected data: StakeholdersStoreData = {}

    protected state: StakeholdersStoreState = {}

    protected handleStakeholdersApi: (params: StakeholdersApiRequest) => Promise<StakeholdersApiResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleStakeholdersApi = lastOfCalls(handleStakeholdersApi)
    }

    public async fetch(params: StakeholdersApiRequest): Promise<void> {
        this.setLoading(true)

        try {
            const data = await this.handleStakeholdersApi(params)

            if (data) {
                this.setStakeholders(data)
                this.setLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setLoading(false)
        }
    }

    protected setLoading(value: boolean): void {
        this.state.isLoading = value
    }

    protected setStakeholders(data: StakeholdersApiResponse): void {
        this.data.stakeholders = data
    }

    public get totalCount(): number | undefined {
        return this.data.stakeholders?.totalCount
    }

    public get items(): Stakeholder[] {
        return this.data.stakeholders?.stakeholders
            ? [...this.data.stakeholders.stakeholders]
            : []
    }

    public get isLoading(): boolean {
        return Boolean(this.state.isLoading)
    }

}
