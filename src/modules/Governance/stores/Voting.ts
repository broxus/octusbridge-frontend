import ton, { Address, Contract, Subscriber } from 'ton-inpage-provider'
import { makeAutoObservable, toJS } from 'mobx'

import {
    BridgeConstants, CastedVotes, StackingAbi, StackingDetails, UserDataAbi, UserDetails,
} from '@/misc'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { Proposal, VotingStoreData, VotingStoreState } from '@/modules/Governance/types'
import { calcGazToUnlockVotes, handleProposalsByIds } from '@/modules/Governance/utils'
import { error, throwException } from '@/utils'
import { GasToCastVote } from '@/config'

export class VotingStore {

    protected state: VotingStoreState = {}

    protected data: VotingStoreData = {}

    constructor(
        protected tonWallet: TonWalletService,
        protected tokensCache: TokensCacheService,
    ) {
        makeAutoObservable(this)
    }

    protected async syncToken(): Promise<void> {
        try {
            if (!this.data.stakingDetails?.tokenRoot) {
                throwException('Staking details must be defined in data')
            }

            await this.tokensCache.syncTonToken(this.data.stakingDetails?.tokenRoot.toString())
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncCastedProposals(): Promise<void> {
        try {
            if (!this.castedVotes) {
                throwException('Casted votes must be defined in data')
            }

            const proposalIds = this.castedVotes.map(([id]) => parseInt(id, 10))
            const proposals = await handleProposalsByIds(proposalIds)

            this.setProposals(proposals)
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncStakingData(): Promise<void> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stakingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(this.tonWallet.address),
            }).call()

            const userDataContract = new Contract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            const { casted_votes: castedVotes } = await userDataContract.methods.casted_votes({
            }).call()

            const { value0: lockedTokens } = await userDataContract.methods.lockedTokens({
                answerId: 0,
            }).call()

            const { value0: stakingDetails } = await stakingContract.methods.getDetails({
                answerId: 0,
            }).call()

            this.setStakingDetails(stakingDetails)
            this.setUserDetails(userDetails, lockedTokens)
            this.setCastedVotes(castedVotes)
        }
        catch (e) {
            error(e)
        }
    }

    public async castVote(proposalId: number, support: boolean, reason?: string): Promise<void> {
        this.setCastLoading(true)

        const subscriber = new Subscriber(ton)

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stakingContract.methods.getUserDataAddress({
                answerId: 0,
                user: this.tonWallet.account.address,
            }).call()

            const userDataContract = new Contract(UserDataAbi.Root, userDataAddress)

            const successStream = subscriber
                .transactions(userDataContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => userDataContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'VoteCast') {
                        if (result.data.proposal_id === `${proposalId}`) {
                            return true
                        }
                    }
                    return undefined
                })
                .first()

            if (reason) {
                await stakingContract.methods.castVoteWithReason({
                    reason,
                    support,
                    proposal_id: proposalId,
                })
                    .send({
                        from: this.tonWallet.account.address,
                        amount: GasToCastVote,
                    })
            }
            else {
                await stakingContract.methods.castVote({
                    support,
                    proposal_id: proposalId,
                })
                    .send({
                        from: this.tonWallet.account.address,
                        amount: GasToCastVote,
                    })
            }

            await successStream
            await this.sync()
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setCastLoading(false)
    }

    public async unlockCastedVote(proposalIds: number[]): Promise<boolean> {
        this.setUnlockVoteLoading(true)

        let success = false
        const subscriber = new Subscriber(ton)

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stakingContract.methods.getUserDataAddress({
                answerId: 0,
                user: this.tonWallet.account.address,
            }).call()

            const userDataContract = new Contract(UserDataAbi.Root, userDataAddress)

            let testIds = proposalIds.map(id => `${id}`)
            const successStream = subscriber
                .transactions(userDataContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => userDataContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'UnlockCastedVotes') {
                        testIds = testIds.filter(id => id !== result.data.proposal_id)
                    }
                    if (testIds.length === 0) {
                        return true
                    }
                    return undefined
                })
                .first()

            await stakingContract.methods.tryUnlockCastedVotes({
                proposal_ids: proposalIds,
            })
                .send({
                    from: this.tonWallet.account.address,
                    amount: calcGazToUnlockVotes(proposalIds.length),
                })

            await successStream
            await this.sync()
            success = true
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setUnlockVoteLoading(false)

        return success
    }

    public async sync(): Promise<void> {
        try {
            await this.syncStakingData()
            await this.syncCastedProposals()
            await this.syncToken()
        }
        catch (e) {
            error(e)
        }
    }

    public async fetch(): Promise<void> {
        this.setLoading(true)
        try {
            await this.sync()
        }
        catch (e) {
            error(e)
        }
        this.setLoading(false)
    }

    protected setUserDetails(userDetails: UserDetails, lockedTokens: string): void {
        this.data.userDetails = userDetails
        this.data.lockedTokens = lockedTokens
    }

    protected setCastedVotes(castedVotes: CastedVotes): void {
        this.data.castedVotes = castedVotes
    }

    protected setProposals(proposals: Proposal[]): void {
        this.data.proposals = proposals
    }

    protected setStakingDetails(stakingDetails: StackingDetails): void {
        this.data.stakingDetails = stakingDetails
    }

    protected setLoading(loading: boolean): void {
        this.state.loading = loading
    }

    protected setCastLoading(loading: boolean): void {
        this.state.castLoading = loading
    }

    protected setUnlockVoteLoading(loading: boolean): void {
        this.state.unlockVoteLoading = loading
    }

    public get connected(): boolean {
        return this.tokensCache.isInitialized && this.tonWallet.isConnected
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

    public get castLoading(): boolean {
        return !!this.state.castLoading
    }

    public get unlockVoteLoading(): boolean {
        return !!this.state.unlockVoteLoading
    }

    public get tokenBalance(): string | undefined {
        return this.data.userDetails?.token_balance
    }

    public get castedVotes(): CastedVotes | undefined {
        return toJS(this.data.castedVotes)
    }

    public get proposals(): Proposal[] | undefined {
        return toJS(this.data.proposals)
    }

    public get lockedTokens(): string | undefined {
        return this.data.lockedTokens
    }

    public get token(): TokenCache | undefined {
        if (!this.data.stakingDetails) {
            return undefined
        }

        return this.tokensCache.get(this.data.stakingDetails.tokenRoot.toString())
    }

    public get tokenDecimals(): number | undefined {
        return this.token?.decimals
    }

}
