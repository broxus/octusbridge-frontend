import {
    action, IReactionDisposer, makeAutoObservable, reaction, runInAction,
} from 'mobx'
import { Address } from 'everscale-inpage-provider'
import BigNumber from 'bignumber.js'

import { AccountDataStoreData, AccountDataStoreState, CurrencyResponse } from '@/modules/Staking/types'
import { getStakingContract, handleCurrency } from '@/modules/Staking/utils'
import { TokensCacheService } from '@/stores/TokensCacheService'
import {
    CastedVotes, PendingReward, RelayConfig, StackingDetails, UserDataAbi, UserDetails,
} from '@/misc'
import { error, throwException } from '@/utils'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'
import { TokenCache } from '@/types'

export class AccountDataStore {

    protected syncDisposer?: IReactionDisposer

    protected state: AccountDataStoreState = {}

    protected data: AccountDataStoreData = {}

    protected stakingContract = getStakingContract()

    constructor(
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: EverWalletService,
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

    protected async fetchRelayConfig(): Promise<RelayConfig | undefined> {
        try {
            const { value0: relayConfig } = await this.stakingContract.methods.getRelayConfig({
                answerId: 0,
            }).call()

            return relayConfig
        }
        catch (e) {
            return undefined
        }
    }

    protected async fetchStakingDetails(): Promise<StackingDetails | undefined> {
        try {
            const { value0: stackingDetails } = await this.stakingContract.methods.getDetails({
                answerId: 0,
            }).call()

            return stackingDetails
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    protected async fetchUserDataAddress(): Promise<Address | undefined> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const { value0: userDataAddress } = await this.stakingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(this.tonWallet.address),
            }).call()

            return userDataAddress
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    protected async fetchUserDetails(userDataAddress: Address): Promise<UserDetails | undefined> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

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

    public async fetchCastedVotes(userDataAddress: Address): Promise<CastedVotes | undefined> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const userDataContract = rpc.createContract(UserDataAbi.Root, userDataAddress)

            const { casted_votes: castedVotes } = await userDataContract.methods.casted_votes({}).call()

            return castedVotes
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    protected async fetchPendingReward(userDetails: UserDetails): Promise<PendingReward | undefined> {
        try {
            const { value0: pendingReward } = await this.stakingContract.methods.pendingReward({
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
            let pendingReward: PendingReward | undefined,
                currency: CurrencyResponse | undefined

            const [relayConfig, stakingDetails, userDataAddress] = await Promise.all([
                this.fetchRelayConfig(),
                this.fetchStakingDetails(),
                this.fetchUserDataAddress(),
            ])

            const [userDetails, castedVotes] = await Promise.all([
                userDataAddress ? this.fetchUserDetails(userDataAddress) : undefined,
                userDataAddress ? this.fetchCastedVotes(userDataAddress) : undefined,
            ])

            if (stakingDetails) {
                [currency] = await Promise.all([
                    handleCurrency(stakingDetails.tokenRoot.toString()).catch(_ => undefined),
                    await this.tokensCache.syncToken(stakingDetails.tokenRoot.toString()),
                ])
            }

            if (userDetails) {
                pendingReward = await this.fetchPendingReward(userDetails)
            }

            runInAction(() => {
                this.data = {
                    stakingDetails,
                    userDetails,
                    pendingReward,
                    relayConfig,
                    currency,
                    castedVotes,
                }
                this.state.hasAccount = !!userDetails
            })
        }
        catch (e) {
            error(e)
            runInAction(() => {
                this.state.hasAccount = false
            })
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
        return this.tokensCache.isReady && this.tonWallet.isConnected
    }

    public get token(): TokenCache | undefined {
        if (!this.data.stakingDetails) {
            return undefined
        }
        return this.tokensCache.get(this.data.stakingDetails.tokenRoot.toString())
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
        return this.data.stakingDetails?.tokenWallet
    }

    public get pendingReward(): string | undefined {
        return this.data.pendingReward
    }

    public get totalReward(): string | undefined {
        const { stakingDetails, userDetails, relayConfig } = this.data

        if (!stakingDetails || !relayConfig || !userDetails) {
            return undefined
        }

        const scalingFactor = 10 ** 18
        const now = Math.floor(Date.now() / 1000)
        const lastRewardTime = parseInt(stakingDetails.lastRewardTime, 10)
        const multiplier = now - lastRewardTime
        const newRewardBN = new BigNumber(relayConfig.userRewardPerSecond).times(multiplier)
        const totalReward = stakingDetails.rewardRounds.map(item => item.totalReward)
        const accRewardPerShare = stakingDetails.rewardRounds.map(item => item.accRewardPerShare)

        totalReward[totalReward.length - 1] = newRewardBN
            .plus(totalReward[totalReward.length - 1])
            .toFixed()

        accRewardPerShare[accRewardPerShare.length - 1] = newRewardBN
            .times(scalingFactor)
            .dividedBy(stakingDetails.tokenBalance)
            .plus(accRewardPerShare[accRewardPerShare.length - 1])
            .toFixed()

        const rewards = []
        for (let i = userDetails.rewardRounds.length - 1; i < totalReward.length; i++) {
            const reward = new BigNumber(userDetails.token_balance)
                .times(accRewardPerShare[i])
                .dividedBy(scalingFactor)
                .minus(userDetails.rewardRounds[i] ? userDetails.rewardRounds[i].reward_debt : 0)
                .plus(userDetails.rewardRounds[i] ? userDetails.rewardRounds[i].reward_balance : 0)
                .toFixed(0)

            rewards.push(reward)
        }

        const total = rewards.reduce((acc, item) => new BigNumber(acc).plus(item).toFixed())

        return total
    }

    public get lockedReward(): string | undefined {
        if (!this.totalReward || !this.pendingReward) {
            return undefined
        }

        return new BigNumber(this.totalReward)
            .minus(this.pendingReward)
            .toFixed()
    }

    public get totalRewardUsd(): string | undefined {
        if (!this.totalReward || !this.data.currency || this.tokenDecimals === undefined) {
            return undefined
        }

        return new BigNumber(this.totalReward)
            .shiftedBy(-this.tokenDecimals)
            .times(this.data.currency.price)
            .toFixed()
    }

    public get pendingRewardUsd(): string | undefined {
        if (!this.pendingReward || !this.data.currency || this.tokenDecimals === undefined) {
            return undefined
        }

        return new BigNumber(this.pendingReward)
            .shiftedBy(-this.tokenDecimals)
            .times(this.data.currency.price)
            .toFixed()
    }

    public get tokenStakingBalanceUsd(): string | undefined {
        if (!this.tokenStakingBalance || !this.data.currency || this.tokenDecimals === undefined) {
            return undefined
        }

        return new BigNumber(this.tokenStakingBalance)
            .shiftedBy(-this.tokenDecimals)
            .times(this.data.currency.price)
            .toFixed()
    }

    public get hasAccount(): boolean | undefined {
        return this.state.hasAccount
    }

    public get castedVotes(): CastedVotes | undefined {
        return this.data.castedVotes
    }

    public get claimEnabled(): boolean {
        const userRewardRounds = this.data.userDetails?.rewardRounds
        const stakingRewardRounds = this.data.stakingDetails?.rewardRounds

        if (userRewardRounds && stakingRewardRounds) {
            if (userRewardRounds.length === stakingRewardRounds.length) {
                return userRewardRounds.slice(0, -1).some(item => (
                    new BigNumber(item.reward_balance).gt(0)
                ))
            }
            if (userRewardRounds.length < stakingRewardRounds.length) {
                return stakingRewardRounds.slice(0, -1).some(item => (
                    new BigNumber(item.totalReward).gt(0)
                ))
            }
        }

        return false
    }

}
