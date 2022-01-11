import { makeAutoObservable } from 'mobx'

import {
    Transfer, TransfersRequest, TransfersResponse,
    TransfersStoreData, TransfersStoreState,
} from '@/modules/Transfers/types'
import { handleTransfers } from '@/modules/Transfers/utils'
import { error, lastOfCalls } from '@/utils'

export class TransfersStore {

    protected data: TransfersStoreData = {}

    protected state: TransfersStoreState = {
        page: 1,
        limit: 10,
    }

    protected handleTransfers: (params: TransfersRequest) => Promise<TransfersResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleTransfers = lastOfCalls(handleTransfers)
    }

    public async fetch(params: TransfersRequest): Promise<void> {
        this.setLoading(true)

        try {
            const apiResponse = await this.handleTransfers(params)

            if (apiResponse) {
                this.setApiResponse(apiResponse)
                this.setLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setLoading(false)
        }
    }

    protected setApiResponse(apiResponse: TransfersResponse): void {
        this.data.apiResponse = apiResponse
    }

    protected setLoading(loading: boolean): void {
        this.state.loading = loading
    }

    public get items(): Transfer[] {
        return this.data.apiResponse?.transfers || []
    }

    public get totalCount(): number | undefined {
        return this.data.apiResponse?.totalCount
    }

    public get loading(): boolean {
        return Boolean(this.state.loading)
    }

}
