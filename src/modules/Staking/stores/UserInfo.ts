import { makeAutoObservable } from 'mobx'

import { handleUserApi } from '@/modules/Staking/utils'
import {
    StakingUserApiRequest, StakingUserApiResponse, UserStakingStoreData,
} from '@/modules/Staking/types'
import { error, lastOfCalls } from '@/utils'

export class UserInfoStore {

    protected data: UserStakingStoreData = {}

    protected handleUserApi: (params: StakingUserApiRequest) => Promise<StakingUserApiResponse | undefined>

    constructor() {
        makeAutoObservable(this)

        this.handleUserApi = lastOfCalls(handleUserApi)
    }

    public async fetch(params: StakingUserApiRequest): Promise<void> {
        try {
            const apiResponse = await this.handleUserApi(params)

            if (apiResponse) {
                this.setUserInfo(apiResponse)
            }
        }
        catch (e) {
            error(e)
        }
    }

    protected setUserInfo(apiResponse: StakingUserApiResponse): void {
        this.data.userInfo = apiResponse
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

}
