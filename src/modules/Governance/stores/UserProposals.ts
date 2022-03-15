import { makeAutoObservable } from 'mobx'

import {
    ProposalsRequest, ProposalWithVote, UserProposalsResponse,
    UserProposalsStoreData, UserProposalsStoreState,
} from '@/modules/Governance/types'
import { handleUserProposals } from '@/modules/Governance/utils'
import { error, lastOfCalls } from '@/utils'

export class UserProposalsStore {

    protected data: UserProposalsStoreData = {}

    protected state: UserProposalsStoreState = {}

    protected handleUserProposals: (
        address: string,
        params: ProposalsRequest,
    ) => Promise<UserProposalsResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleUserProposals = lastOfCalls(handleUserProposals)
    }

    public dispose(): void {
        this.state = {}
        this.data = {}
    }

    public async fetch(address: string, params: ProposalsRequest): Promise<void> {
        this.setLoading(true)

        try {
            const response = await this.handleUserProposals(address, params)
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

    protected setResponse(response: UserProposalsResponse): void {
        this.data.response = response
    }

    public get totalCount(): number | undefined {
        return this.data.response?.totalCount
    }

    public get items(): ProposalWithVote[] {
        return this.data.response?.proposalWithVotes || []
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

}
