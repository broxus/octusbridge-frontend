import { action, makeAutoObservable } from 'mobx'

import { handleTransactionsApi } from '@/modules/Staking/utils'
import {
    Transaction, TransactionsApiRequest, TransactionsApiResponse,
    TransactionsStoreData, TransactionsStoreState,
} from '@/modules/Staking/types'
import { error, lastOfCalls } from '@/utils'

export class TransactionsStore {

    protected data: TransactionsStoreData = {}

    protected state: TransactionsStoreState = {}

    protected handleTransactionsApi: (params: TransactionsApiRequest) => Promise<TransactionsApiResponse | undefined>

    constructor() {
        makeAutoObservable(this, {
            fetch: action.bound,
        })

        this.handleTransactionsApi = lastOfCalls(handleTransactionsApi)
    }

    public async fetch(params: TransactionsApiRequest): Promise<void> {
        this.setLoading(true)

        try {
            const apiResponse = await this.handleTransactionsApi(params)

            if (apiResponse) {
                this.setTransactions(apiResponse)
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

    protected setTransactions(data: TransactionsApiResponse): void {
        this.data.transactions = data
    }

    public get totalCount(): number | undefined {
        return this.data.transactions?.totalCount
    }

    public get items(): Transaction[] {
        return this.data.transactions?.transactions
            ? [...this.data.transactions?.transactions]
            : []
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

}
