import { makeAutoObservable } from 'mobx'

import { UserDataStore } from '@/modules/Governance/stores/UserData'
import { UserStatsStoreData } from '@/modules/Governance/types'
import { handleProposalsCount, handleStakeholder } from '@/modules/Governance/utils'
import { TonWalletService } from '@/stores/TonWalletService'
import { error } from '@/utils'

export class UserStatsStore {

    protected data: UserStatsStoreData = {}

    constructor(
        protected tonWallet: TonWalletService,
        protected userData: UserDataStore,
    ) {
        makeAutoObservable(this)
    }

    public init(): void {
        this.userData.init()
        this.sync()
    }

    public dispose(): void {
        this.data = {}
        this.userData.dispose()
    }

    public async sync(): Promise<void> {
        if (!this.tonWallet.address) {
            return
        }

        try {
            const [stakeholder, count] = await Promise.all([
                handleStakeholder(this.tonWallet.address),
                handleProposalsCount([this.tonWallet.address]),
            ])
            this.setData('stakeholder', stakeholder)

            if (count && count[0]) {
                this.setData('count', count[0].count)
            }
        }
        catch (e) {
            error(e)
        }
    }

    protected setData<K extends keyof UserStatsStoreData>(key: K, value: UserStatsStoreData[K]): void {
        this.data[key] = value
    }

    public get isConnected(): boolean {
        return this.tonWallet.isConnected
    }


    public get votingPower(): string | undefined {
        return this.userData.tokenBalance
    }

    public get tokenDecimals(): number | undefined {
        return this.userData.token?.decimals
    }

    public get votingWeight(): string | undefined {
        return this.data.stakeholder?.voteWeight
    }

    public get proposalsVotedCount(): number | undefined {
        return this.data.count
    }

}
