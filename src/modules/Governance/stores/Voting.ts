import { makeAutoObservable, toJS } from 'mobx'

import { CastedVotes, StackingAbi, UserDataAbi } from '@/misc'
import { EverWalletService } from '@/stores/EverWalletService'
import { VotingStoreState } from '@/modules/Governance/types'
import { UserDataStore } from '@/modules/Governance/stores/UserData'
import { calcGazToUnlockVotes } from '@/modules/Governance/utils'
import { error, throwException } from '@/utils'
import { GasToCastVote, StakingAccountAddress } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { TokenCache } from '@/types'

export class VotingStore {

    protected state: VotingStoreState = {}

    constructor(
        protected tonWallet: EverWalletService,
        protected userData: UserDataStore,
    ) {
        makeAutoObservable(this)
    }

    public init(): void {
        this.userData.init()
    }

    public dispose(): void {
        this.userData.dispose()
        this.reset()
    }

    public reset(): void {
        this.state = {}
    }

    public async castVote(proposalId: number, support: boolean, reason?: string): Promise<void> {
        this.setState('castLoading', true)

        const subscriber = rpc.createSubscriber()

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            if (!this.userData.userDataAddress) {
                throwException('userDataAddress must be defined')
            }

            const stakingContract = rpc.createContract(StackingAbi.Root, StakingAccountAddress)
            const userDataContract = rpc.createContract(UserDataAbi.Root, this.userData.userDataAddress)

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
            await this.userData.sync()
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setState('castLoading', false)
    }

    public async unlockCastedVote(proposalIds: number[]): Promise<boolean> {
        this.setState('unlockLoading', true)

        let success = false
        const subscriber = rpc.createSubscriber()

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            if (!this.userData.userDataAddress) {
                throwException('userDataAddress must be defined')
            }

            const stakingContract = rpc.createContract(StackingAbi.Root, StakingAccountAddress)
            const userDataContract = rpc.createContract(UserDataAbi.Root, this.userData.userDataAddress)

            let testIds = proposalIds.map(id => `${id}`)
            const successStream = subscriber
                .transactions(userDataContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => userDataContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'UnlockCastedVotes') {
                        if (testIds.includes(result.data.proposal_id)) {
                            testIds = testIds.filter(id => id !== result.data.proposal_id)
                            this.addUnlockedId(parseInt(result.data.proposal_id, 10))
                        }
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
            await this.userData.sync()
            success = true
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setState('unlockLoading', false)

        return success
    }

    public addUnlockedId(id: number): void {
        this.setState('unlockedIds', [...this.unlockedIds, id])
    }

    protected setState<K extends keyof VotingStoreState>(key: K, value: VotingStoreState[K]): void {
        this.state[key] = value
    }

    public get isConnected(): boolean {
        return this.userData.isConnected && this.tonWallet.isConnected
    }

    public get loading(): boolean {
        return this.userData.hasAccount === undefined
    }

    public get castLoading(): boolean {
        return !!this.state.castLoading
    }

    public get unlockLoading(): boolean {
        return !!this.state.unlockLoading
    }

    public get tokenBalance(): string | undefined {
        return this.userData.tokenBalance
    }

    public get castedVotes(): CastedVotes | undefined {
        return toJS(this.userData.castedVotes)
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

    public get unlockedIds(): number[] {
        return this.state.unlockedIds || []
    }

    public get votingWeight(): string | undefined {
        return this.userData.votingWeight
    }

    public get votingPower(): string | undefined {
        return this.userData.tokenBalance
    }

    public get votesCount(): number | undefined {
        return this.userData.votesCount
    }

}
