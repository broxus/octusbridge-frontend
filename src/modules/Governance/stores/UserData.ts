import { Address } from 'everscale-inpage-provider'
import {
    IReactionDisposer, makeAutoObservable, reaction, toJS,
} from 'mobx'

import { UserDataStoreData, UserDataStoreState } from '@/modules/Governance/types'
import {
    BridgeConstants, CastedVotes, StackingAbi, UserDataAbi,
} from '@/misc'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { error, throwException } from '@/utils'
import rpc from '@/hooks/useRpcClient'

export class UserDataStore {

    protected data: UserDataStoreData = {}

    protected state: UserDataStoreState = {}

    protected syncDisposer?: IReactionDisposer

    constructor(
        protected tonWallet: TonWalletService,
        protected tokensCache: TokensCacheService,
    ) {
        makeAutoObservable(this)
    }

    public init(): void {
        this.syncDisposer = reaction(
            () => this.isConnected,
            isConnected => (isConnected ? this.sync() : this.reset()),
            {
                fireImmediately: true,
            },
        )
    }

    public dispose(): void {
        this.syncDisposer?.()
        this.reset()
    }

    public reset(): void {
        this.data = {}
        this.state = {}
    }

    protected async syncStaking(): Promise<void> {
        try {
            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            const stakingContract = rpc.createContract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

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

    public async syncUserData(): Promise<void> {
        try {
            if (!this.data.userDataAddress) {
                throwException('userDataAddress must be defined in data')
            }

            const userDataContract = rpc.createContract(UserDataAbi.Root, this.data.userDataAddress)

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
            this.setData('tokenBalance', userDetails.token_balance)
            this.setState('hasAccount', true)
        }
        catch (e) {
            this.setState('hasAccount', false)
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
        }
        catch (e) {
            error(e)
        }
    }

    protected setData<K extends keyof UserDataStoreData>(key: K, value: UserDataStoreData[K]): void {
        this.data[key] = value
    }

    protected setState<K extends keyof UserDataStoreState>(key: K, value: UserDataStoreState[K]): void {
        this.state[key] = value
    }

    public get isConnected(): boolean {
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
        return this.data.tokenBalance
    }

    public get userDataAddress(): Address | undefined {
        return this.data.userDataAddress
    }

    public get hasAccount(): boolean | undefined {
        return this.state.hasAccount
    }

}
