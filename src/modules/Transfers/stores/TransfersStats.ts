import { makeAutoObservable, runInAction } from 'mobx'

import { TransfersStatsStoreData } from '@/modules/Transfers/types'
import { handleTransfers } from '@/modules/Transfers/utils'
import { error } from '@/utils'

export class TransfersStatsStore {

    protected data: TransfersStatsStoreData = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(): Promise<void> {
        try {
            const transfers = await handleTransfers({
                limit: 1,
                offset: 0,
                ordering: 'createdatascending',
            })

            runInAction(() => {
                this.data.totalCount = transfers.totalCount
            })
        }
        catch (e) {
            error(e)
        }
    }

    public get totalCount(): number | undefined {
        return this.data.totalCount
    }

}
