import { makeAutoObservable } from 'mobx'

import {
    Vote, VotesRequest, VotesResponse, VotesStoreData, VotesStoreState,
} from '@/modules/Governance/types'
import { handleVotes } from '@/modules/Governance/utils'
import { error, lastOfCalls } from '@/utils'

export class VotesStore {

    protected data: VotesStoreData = {}

    protected state: VotesStoreState = {}

    protected handleVotes: (params: VotesRequest) => Promise<VotesResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleVotes = lastOfCalls(handleVotes)
    }

    public dispose(): void {
        this.data = {}
        this.state = {}
    }

    public async fetch(params: VotesRequest): Promise<void> {
        this.setLoading(true)

        try {
            const response = await this.handleVotes(params)
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

    protected setResponse(response: VotesResponse): void {
        this.data.response = response
    }

    public get totalCount(): number {
        return this.data.response?.totalCount || 1
    }

    public get items(): Vote[] {
        return this.data.response?.votes || []
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

}
