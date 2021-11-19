import { makeAutoObservable } from 'mobx'

import {
    TransfersApiRequest, TransfersApiResponse, TransfersApiTransfer,
    TransfersStoreData, TransfersStoreState,
} from '@/modules/Transfers/types'
import { handleTransfersApi } from '@/modules/Transfers/utils'
import { error, lastOfCalls } from '@/utils'

export class TransfersStore {

    protected data: TransfersStoreData = {}

    protected state: TransfersStoreState = {
        page: 1,
        limit: 10,
    }

    protected apiHandle: (params: TransfersApiRequest) => Promise<Promise<TransfersApiResponse> | undefined>

    constructor() {
        makeAutoObservable(this)

        this.apiHandle = lastOfCalls(handleTransfersApi)
    }

    public async fetch(params: TransfersApiRequest): Promise<void> {
        this.setLoading(true)

        try {
            const apiResponse = await this.apiHandle(params)

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

    protected setApiResponse(apiResponse: TransfersApiResponse): void {
        this.data.apiResponse = apiResponse
    }

    protected setLoading(loading: boolean): void {
        this.state.loading = loading
    }

    public get items(): TransfersApiTransfer[] {
        return this.data.apiResponse?.transfers || []
    }

    public get totalCount(): number | undefined {
        return this.data.apiResponse?.totalCount
    }

}
