import { makeAutoObservable } from 'mobx'

import {
    Proposal, ProposalsRequest, ProposalsResponse, ProposalsStoreData,
    ProposalsStoreState,
} from '@/modules/Governance/types'
import { handleProposals } from '@/modules/Governance/utils'
import { error, lastOfCalls } from '@/utils'

export class ProposalsStore {

    protected data: ProposalsStoreData = {}

    protected state: ProposalsStoreState = {}

    protected handleProposals: (params: ProposalsRequest) => Promise<ProposalsResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleProposals = lastOfCalls(handleProposals)
    }

    public async fetch(params: ProposalsRequest): Promise<void> {
        this.setLoading(true)

        try {
            const response = await this.handleProposals(params)
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

    protected setResponse(response: ProposalsResponse): void {
        this.data.response = response
    }

    public get totalCount(): number | undefined {
        return this.data.response?.totalCount
    }

    public get items(): Proposal[] {
        return this.data.response?.proposals || []
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

}
