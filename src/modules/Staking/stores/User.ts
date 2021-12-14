import { makeAutoObservable } from 'mobx'

import { handleTransactionsApi, handleUserApi } from '@/modules/Staking/utils'
import {
    StakingUserApiRequest, StakingUserApiResponse, Transaction,
    TransactionsApiRequest, TransactionsApiResponse, UserStakingStoreData,
    UserStakingStoreState,
} from '@/modules/Staking/types'
import { error, lastOfCalls } from '@/utils'

export class UserStore {

    protected data: UserStakingStoreData = {}

    protected state: UserStakingStoreState = {}

    protected userApiHandle: (params: StakingUserApiRequest) => Promise<StakingUserApiResponse | undefined>

    protected transactionsApiHandle: (params: TransactionsApiRequest) => Promise<TransactionsApiResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.userApiHandle = lastOfCalls(handleUserApi)
        this.transactionsApiHandle = lastOfCalls(handleTransactionsApi)
    }

    public async fetchTransactions(params: TransactionsApiRequest): Promise<void> {
        this.setTransactionsLoading(true)

        try {
            const apiResponse = await this.transactionsApiHandle(params)

            if (apiResponse) {
                this.setTransactions(apiResponse)
                this.setTransactionsLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setTransactionsLoading(false)
        }
    }

    public async fetchUserInfo(params: StakingUserApiRequest): Promise<void> {
        this.setUserLoading(true)

        try {
            const apiResponse = await this.userApiHandle(params)

            if (apiResponse) {
                this.setUserInfo(apiResponse)
                this.setUserLoading(false)
            }
        }
        catch (e) {
            error(e)
            this.setUserLoading(false)
        }
    }

    protected setUserLoading(loading: boolean): void {
        this.state.userLoading = loading
    }

    protected setUserInfo(apiResponse: StakingUserApiResponse): void {
        this.data.userInfo = apiResponse
    }

    protected setTransactionsLoading(loading: boolean): void {
        this.state.transactionsLoading = loading
    }

    protected setTransactions(data: TransactionsApiResponse): void {
        this.data.transactions = data
    }

    public get userTvl(): string | undefined {
        return this.data.userInfo?.userTvl
    }

    public get userTvlChange(): string | undefined {
        return this.data.userInfo?.userTvlChange
    }

    public get userFrozenStake(): string | undefined {
        return this.data.userInfo?.userFrozenStake
    }

    public get user30dReward(): string | undefined {
        return this.data.userInfo?.user30dReward
    }

    public get user30dRewardChange(): string | undefined {
        return this.data.userInfo?.user30dRewardChange
    }

    public get averageApr(): string | undefined {
        return this.data.userInfo?.averageApr
    }

    public get transactionsTotalCount(): number | undefined {
        return this.data.transactions?.totalCount
    }

    public get transactionsItems(): Transaction[] {
        return this.data.transactions?.transactions
            ? [...this.data.transactions?.transactions]
            : []
    }

    public get transactionsLoading(): boolean {
        return Boolean(this.state.transactionsLoading)
    }

}
