import { makeAutoObservable, runInAction } from 'mobx'

import { TransfersMainInfoResponse, TransfersStatsStoreData } from '@/modules/Transfers/types'
import { handleMainInfo, handleTransfers } from '@/modules/Transfers/utils'
import { error } from '@/utils'

export class TransfersStatsStore {

    protected data: TransfersStatsStoreData = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(): Promise<void> {
        try {
            const [mainInfo, transfers] = await Promise.all([
                handleMainInfo(),
                handleTransfers({
                    limit: 1,
                    offset: 0,
                    ordering: 'createdatascending',
                }),
            ])

            runInAction(() => {
                this.data.totalCount = transfers.totalCount
                this.data.mainInfo = mainInfo
            })
        }
        catch (e) {
            error(e)
        }
    }

    public get totalCount(): number | undefined {
        return this.data.totalCount
    }

    public get mainInfo(): TransfersMainInfoResponse | undefined {
        if (!this.data.mainInfo) {
            return undefined
        }

        return { ...this.data.mainInfo }
    }

}
