import {
    action, IReactionDisposer, makeAutoObservable, reaction, runInAction,
} from 'mobx'
import { Address } from 'everscale-inpage-provider'

import { AccountDataStoreData, AccountDataStoreState } from '@/modules/Staking/types'
import { getStackingContract } from '@/modules/Staking/utils'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import {
    PendingReward, StackingDetails, UserDataAbi, UserDetails,
} from '@/misc'
import { error, throwException } from '@/utils'
import rpc from '@/hooks/useRpcClient'

export class AccountDataStore {

    protected syncDisposer?: IReactionDisposer

    protected state: AccountDataStoreState = {}

    protected data: AccountDataStoreData = {}

    protected stackingContract = getStackingContract()

    constructor(
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this, {
            connectToTonWallet: action.bound,
        })
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
        this.state = {}
        this.data = {}
    }

    protected async fetchStackingDetails(): Promise<StackingDetails | undefined> {
        try {
            const { value0: stackingDetails } = await this.stackingContract.methods.getDetails({
                answerId: 0,
            }).call()

            return stackingDetails
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    protected async fetchUserDetails(): Promise<UserDetails | undefined> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const { value0: userDataAddress } = await this.stackingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(this.tonWallet.address),
            }).call()

            const userDataContract = rpc.createContract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            return userDetails
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    protected async fetchPendingReward(userDetails: UserDetails): Promise<PendingReward | undefined> {
        try {
            const { value0: pendingReward } = await this.stackingContract.methods.pendingReward({
                answerId: 0,
                user_token_balance: userDetails.token_balance,
                user_reward_data: userDetails.rewardRounds,
            }).call()

            return pendingReward
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    public async sync(): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true
        })

        try {
            let pendingReward: PendingReward | undefined
            const stackingDetails = await this.fetchStackingDetails()
            const userDetails = await this.fetchUserDetails()

            if (userDetails) {
                pendingReward = await this.fetchPendingReward(userDetails)
            }

            if (stackingDetails) {
                await this.tokensCache.syncTonToken(stackingDetails.tokenRoot.toString())
            }

            runInAction(() => {
                this.data = { stackingDetails, userDetails, pendingReward }
            })
        }
        catch (e) {
            error(e)
        }

        runInAction(() => {
            this.state.isLoading = false
        })
    }

    public connectToTonWallet(): void {
        this.tonWallet.connect()
    }

    public get isLoading(): boolean {
        return this.state.isLoading || this.tonWallet.isConnecting || this.tonWallet.isInitializing
    }

    public get isConnected(): boolean {
        return this.tokensCache.isInitialized && this.tonWallet.isConnected
    }

    public get token(): TokenCache | undefined {
        if (!this.data.stackingDetails) {
            return undefined
        }
        return this.tokensCache.get(this.data.stackingDetails.tokenRoot.toString())
    }

    public get tokenAddress(): string | undefined {
        return this.token?.root
    }

    public get tokenSymbol(): string | undefined {
        return this.token?.symbol
    }

    public get tokenDecimals(): number | undefined {
        return this.token?.decimals
    }

    public get tokenIcon(): string | undefined {
        return this.token?.icon || undefined
    }

    public get tokenWalletBalance(): string | undefined {
        return this.token?.balance
    }

    public get tokenStakingBalance(): string | undefined {
        return this.data.userDetails?.token_balance
    }

    public get stakingTokenWallet(): Address | undefined {
        return this.data.stackingDetails?.tokenWallet
    }

    public get pendingReward(): string | undefined {
        return this.data.pendingReward
    }

}
