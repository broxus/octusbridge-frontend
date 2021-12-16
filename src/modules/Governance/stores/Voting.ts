import ton, { Contract, Subscriber } from 'ton-inpage-provider'
import { makeAutoObservable, toJS } from 'mobx'

import {
    BridgeConstants, CastedVotes, StackingAbi, UserDataAbi,
} from '@/misc'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenCache } from '@/stores/TokensCacheService'
import { Proposal, VotingStoreState } from '@/modules/Governance/types'
import { UserDataStore } from '@/modules/Governance/stores/UserData'
import { calcGazToUnlockVotes } from '@/modules/Governance/utils'
import { error, throwException } from '@/utils'
import { GasToCastVote } from '@/config'

export class VotingStore {

    protected state: VotingStoreState = {}

    constructor(
        protected tonWallet: TonWalletService,
        protected userData: UserDataStore,
    ) {
        makeAutoObservable(this)
    }

    public async castVote(proposalId: number, support: boolean, reason?: string): Promise<void> {
        this.setState('castLoading', true)

        const subscriber = new Subscriber(ton)

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            if (!this.userData.userDataAddress) {
                throwException('userDataAddress must be defined')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)
            const userDataContract = new Contract(UserDataAbi.Root, this.userData.userDataAddress)

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

        this.setState('castLoading', false)
    }

    public async unlockCastedVote(proposalIds: number[]): Promise<boolean> {
        this.setState('unlockVoteLoading', true)

        let success = false
        const subscriber = new Subscriber(ton)

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            if (!this.userData.userDataAddress) {
                throwException('userDataAddress must be defined')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)
            const userDataContract = new Contract(UserDataAbi.Root, this.userData.userDataAddress)

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

        this.setState('unlockVoteLoading', false)

        return success
    }

    public async sync(): Promise<void> {
        try {
            await this.userData.sync()
        }
        catch (e) {
            error(e)
        }
    }

    public async fetch(): Promise<void> {
        this.setState('loading', true)
        try {
            await this.sync()
        }
        catch (e) {
            error(e)
        }
        this.setState('loading', false)
    }

    protected setState<K extends keyof VotingStoreState>(key: K, value: VotingStoreState[K]): void {
        this.state[key] = value
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
        return this.userData.connected && this.tonWallet.isConnected
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
        return this.userData.tokenBalance
    }

    public get castedVotes(): CastedVotes | undefined {
        return toJS(this.userData.castedVotes)
    }

    public get castedProposals(): Proposal[] | undefined {
        return toJS(this.userData.castedProposals)
    }

    public get lockedTokens(): string | undefined {
        return this.userData.lockedTokens
    }

    public get token(): TokenCache | undefined {
        return this.userData.token
    }

    public get tokenDecimals(): number | undefined {
        return this.token?.decimals
    }

}
