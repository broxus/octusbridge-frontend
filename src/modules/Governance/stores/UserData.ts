import { Address, Contract } from 'ton-inpage-provider'
import { makeAutoObservable, toJS } from 'mobx'

import { Proposal, UserDataStoreData } from '@/modules/Governance/types'
import { handleProposalsByIds } from '@/modules/Governance/utils'
import {
    BridgeConstants, CastedVotes, StackingAbi, UserDataAbi,
} from '@/misc'
import { TokenCache, TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { error, throwException } from '@/utils'

export class UserDataStore {

    protected data: UserDataStoreData = {}

    constructor(
        protected tonWallet: TonWalletService,
        protected tokensCache: TokensCacheService,
    ) {
        makeAutoObservable(this)
    }

    protected async syncCastedProposals(): Promise<void> {
        try {
            if (!this.castedVotes) {
                throwException('Casted votes must be defined in data')
            }

            const proposalIds = this.castedVotes.map(([id]) => parseInt(id, 10))
            const proposals = await handleProposalsByIds(proposalIds)

            this.setData('castedProposals', proposals)
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncStaking(): Promise<void> {
        try {
            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const [
                { value0: userDataAddress },
                { value0: stakingDetails },
            ] = await Promise.all([
                stakingContract.methods.getUserDataAddress({
                    answerId: 0,
                    user: this.tonWallet.account.address,
                }).call(),
                stakingContract.methods.getDetails({
                    answerId: 0,
                }).call(),
            ])

            this.setData('userDataAddress', userDataAddress)
            this.setData('stakingDetails', stakingDetails)
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncUserData(): Promise<void> {
        try {
            if (!this.data.userDataAddress) {
                throwException('userDataAddress must be defined in data')
            }

            const userDataContract = new Contract(UserDataAbi.Root, this.data.userDataAddress)

            const [
                { value0: userDetails },
                { value0: lockedTokens },
                { casted_votes: castedVotes },
            ] = await Promise.all([
                userDataContract.methods.getDetails({
                    answerId: 0,
                }).call(),
                userDataContract.methods.lockedTokens({
                    answerId: 0,
                }).call(),
                userDataContract.methods.casted_votes({}).call(),
            ])

            this.setData('castedVotes', castedVotes)
            this.setData('lockedTokens', lockedTokens)
            this.setData('userDetails', userDetails)
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncToken(): Promise<void> {
        try {
            if (!this.data.stakingDetails?.tokenRoot) {
                throwException('Staking details must be defined in data')
            }

            await this.tokensCache.syncTonToken(this.data.stakingDetails.tokenRoot.toString())
        }
        catch (e) {
            error(e)
        }
    }

    public async sync(): Promise<void> {
        try {
            await this.syncStaking()
            await this.syncUserData()
            await this.syncToken()
            await this.syncCastedProposals()
        }
        catch (e) {
            error(e)
        }
    }

    protected setData<K extends keyof UserDataStoreData>(key: K, value: UserDataStoreData[K]): void {
        this.data[key] = value
    }

    public get connected(): boolean {
        return this.tokensCache.isInitialized && this.tonWallet.isConnected
    }

    public get token(): TokenCache | undefined {
        if (!this.data.stakingDetails) {
            return undefined
        }

        return this.tokensCache.get(this.data.stakingDetails.tokenRoot.toString())
    }

    public get lockedTokens(): string | undefined {
        return this.data.lockedTokens
    }

    public get castedVotes(): CastedVotes | undefined {
        return toJS(this.data.castedVotes)
    }

    public get tokenBalance(): string | undefined {
        return this.data.userDetails?.token_balance
    }

    public get userDataAddress(): Address | undefined {
        return this.data.userDataAddress
    }

    public get castedProposals(): Proposal[] | undefined {
        return this.data.castedProposals
    }

}

const userDataStore = new UserDataStore(
    useTonWallet(),
    useTokensCache(),
)

export function useUserData(): UserDataStore {
    return userDataStore
}
