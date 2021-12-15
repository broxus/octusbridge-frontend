import ton, { Address, Contract, Subscriber } from 'ton-inpage-provider'
import { makeAutoObservable, toJS } from 'mobx'
import BigNumber from 'bignumber.js'

import {
    BridgeConstants, CastedVotes, StackingAbi, UserDataAbi, UserDetails,
} from '@/misc'
import { TonWalletService } from '@/stores/TonWalletService'
import { VotingStoreData, VotingStoreState } from '@/modules/Governance/types'
import { error, throwException } from '@/utils'
import { GasToCastVote, GasToUnlockCastedVote, MinGasToUnlockCastedVotes } from '@/config'

export class VotingStore {

    protected state: VotingStoreState = {}

    protected data: VotingStoreData = {}

    constructor(
        protected tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this)
    }

    protected async syncUserData(): Promise<void> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const stackingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stackingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(this.tonWallet.address),
            }).call()

            const userDataContract = new Contract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({ answerId: 0 }).call()

            const { casted_votes: castedVotes } = await userDataContract.methods.casted_votes({}).call()

            this.setUserDetails(userDetails)
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

            const stackingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stackingContract.methods.getUserDataAddress({
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
                await stackingContract.methods.castVoteWithReason({
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
                await stackingContract.methods.castVote({
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

    public async unlockCastedVote(proposalIds: number[]): Promise<void> {
        this.setUnlockVoteLoading(true)

        const subscriber = new Subscriber(ton)

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            const stackingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stackingContract.methods.getUserDataAddress({
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

            const minAmountBN = new BigNumber(MinGasToUnlockCastedVotes)
            const unlockAmountBN = new BigNumber(GasToUnlockCastedVote)
                .times(proposalIds.length)
                .plus('1000000000')
            const amountBN = minAmountBN.lt(unlockAmountBN) ? unlockAmountBN : minAmountBN

            await stackingContract.methods.tryUnlockCastedVotes({
                proposal_ids: proposalIds,
            })
                .send({
                    from: this.tonWallet.account.address,
                    amount: amountBN.toFixed(),
                })

            await successStream
            await this.sync()
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setUnlockVoteLoading(false)
    }

    public async sync(): Promise<void> {
        try {
            await this.syncUserData()
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

    protected setUserDetails(userDetails: UserDetails): void {
        this.data.userDetails = userDetails
    }

    protected setCastedVotes(castedVotes: CastedVotes): void {
        this.data.castedVotes = castedVotes
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
        return this.tonWallet.isConnected
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

}
