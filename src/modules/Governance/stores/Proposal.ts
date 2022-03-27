import { makeAutoObservable, toJS } from 'mobx'
import { Address } from 'everscale-inpage-provider'

import {
    Description, EthAction, Proposal, ProposalsRequest,
    ProposalsResponse, ProposalState, ProposalStoreData,
    ProposalStoreState, TonAction,
} from '@/modules/Governance/types'
import { handleProposals, parseDescription } from '@/modules/Governance/utils'
import { UserDataStore } from '@/modules/Governance/stores/UserData'
import { VotesStore } from '@/modules/Governance/stores/Votes'
import { ProposalAbi } from '@/misc'
import {
    error, lastOfCalls, throwException, validateUrl,
} from '@/utils'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'

export class ProposalStore {

    protected data: ProposalStoreData = {}

    protected _state: ProposalStoreState = {}

    protected handleProposals: (params: ProposalsRequest) => Promise<ProposalsResponse | undefined>

    public readonly forVotesPreview = new VotesStore()

    public readonly againstVotesPreview = new VotesStore()

    public readonly allVotes = new VotesStore()

    constructor(
        protected proposalId: number,
        protected tonWallet: EverWalletService,
        protected userData: UserDataStore,
    ) {
        makeAutoObservable(this)
        this.handleProposals = lastOfCalls(handleProposals)
    }

    public init(): void {
        this.userData.init()
        this.fetch()
    }

    public dispose(): void {
        this.userData.dispose()
        this.data = {}
        this._state = {}
    }

    public async fetch(): Promise<void> {
        this.setState('proposalLoading', true)

        try {
            await Promise.all([
                this.syncProposal(),
                this.syncVotes(),
            ])
        }
        catch (e) {
            error(e)
        }

        this.setState('proposalLoading', false)
    }

    public async sync(): Promise<void> {
        try {
            await Promise.all([
                this.syncProposal(),
                this.syncVotes(),
                this.allVotes.sync(),
            ])
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncProposal(): Promise<void> {
        try {
            const response = await this.handleProposals({
                proposalId: this.proposalId,
                limit: 1,
                offset: 0,
            })

            if (response) {
                this.setResponse(response)
            }
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncVotes(): Promise<void> {
        try {
            await Promise.all([
                this.forVotesPreview.fetch({
                    limit: 3,
                    offset: 0,
                    proposalId: this.proposalId,
                    support: true,
                    ordering: {
                        column: 'createdAt',
                        direction: 'DESC',
                    },
                }),
                this.againstVotesPreview.fetch({
                    limit: 3,
                    offset: 0,
                    proposalId: this.proposalId,
                    support: false,
                    ordering: {
                        column: 'createdAt',
                        direction: 'DESC',
                    },
                }),
            ])
        }
        catch (e) {
            error(e)
        }
    }

    public async cancel(): Promise<void> {
        this.setState('cancelLoading', true)

        const subscriber = rpc.createSubscriber()

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            if (!this.proposalAddress) {
                throwException('Contract address must be defined in data')
            }

            const proposalContract = rpc.createContract(ProposalAbi.Root, new Address(this.proposalAddress))

            const successStream = subscriber
                .transactions(proposalContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => proposalContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'Canceled') {
                        return true
                    }
                    return undefined
                })
                .first()

            await proposalContract.methods.cancel({})
                .send({
                    from: this.tonWallet.account.address,
                    amount: '2000000000',
                })

            await successStream

            while (this.state !== 'Canceled') {
                await this.sync()
                await new Promise(r => {
                    setTimeout(r, 2000)
                })
            }
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setState('cancelLoading', false)
    }

    public async queue(): Promise<void> {
        this.setState('queueLoading', true)

        const subscriber = rpc.createSubscriber()

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            if (!this.proposalAddress) {
                throwException('Contract address must be defined in data')
            }

            const proposalContract = rpc.createContract(ProposalAbi.Root, new Address(this.proposalAddress))

            const successStream = subscriber
                .transactions(proposalContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => proposalContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'Queued') {
                        return true
                    }
                    return undefined
                })
                .first()

            await proposalContract.methods.queue({}).sendExternal({
                publicKey: this.tonWallet.account.publicKey,
                withoutSignature: true,
            })

            await successStream
            while (this.state !== 'Queued') {
                await this.sync()
                await new Promise(r => {
                    setTimeout(r, 2000)
                })
            }
        }
        catch (e) {
            error(e)
        }

        this.setState('queueLoading', false)
    }

    public async execute(): Promise<void> {
        this.setState('executeLoading', true)

        const subscriber = rpc.createSubscriber()

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            if (!this.proposalAddress) {
                throwException('Contract address must be defined in data')
            }

            const proposalContract = rpc.createContract(ProposalAbi.Root, new Address(this.proposalAddress))

            const successStream = subscriber
                .transactions(proposalContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => proposalContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'Executed') {
                        return true
                    }
                    return undefined
                })
                .first()

            await proposalContract.methods.execute({}).sendExternal({
                publicKey: this.tonWallet.account.publicKey,
                withoutSignature: true,
            })

            await successStream
            while (this.state !== 'Executed') {
                await this.sync()
                await new Promise(r => {
                    setTimeout(r, 2000)
                })
            }
        }
        catch (e) {

        }

        this.setState('executeLoading', false)

    }

    protected setState<K extends keyof ProposalStoreState>(key: K, value: ProposalStoreState[K]): void {
        this._state[key] = value
    }

    protected setResponse(response: ProposalsResponse): void {
        this.data.response = response
    }

    protected get proposal(): Proposal | undefined {
        return toJS(this.data.response?.proposals)?.[0]
    }

    protected get descriptionJson(): Description | undefined {
        return this.proposal?.description
            ? parseDescription(this.proposal.description)
            : undefined
    }

    public get loading(): boolean {
        return Boolean(this.proposalAddress === undefined || this._state.proposalLoading)
    }

    public get cancelLoading(): boolean {
        return !!this._state.cancelLoading
    }

    public get queueLoading(): boolean {
        return !!this._state.queueLoading
    }

    public get executeLoading(): boolean {
        return !!this._state.executeLoading
    }

    public get id(): number | undefined {
        return this.proposal?.proposalId
    }

    public get title(): string | undefined {
        return this.descriptionJson?.title
    }

    public get description(): string | undefined {
        return this.descriptionJson?.description
    }

    public get link(): string | undefined {
        const link = this.descriptionJson?.link
        return link && validateUrl(link) ? link : undefined
    }

    public get endTime(): number | undefined {
        if (!this.proposal?.endTime) {
            return undefined
        }

        return this.proposal.endTime * 1000
    }

    public get state(): ProposalState | undefined {
        return this.proposal?.state
    }

    public get proposer(): string | undefined {
        return this.proposal?.proposer
    }

    public get ethActions(): EthAction[] {
        return this.proposal?.actions?.ethActions || []
    }

    public get tonActions(): TonAction[] {
        return this.proposal?.actions?.tonActions || []
    }

    public get quorumVotes(): string | undefined {
        return this.proposal?.quorumVotes
    }

    public get forVotes(): string | undefined {
        return this.proposal?.forVotes
    }

    public get againstVotes(): string | undefined {
        return this.proposal?.againstVotes
    }

    public get proposalAddress(): string | undefined {
        return this.proposal?.proposalAddress
    }

    public get createdAt(): number | undefined {
        return this.proposal?.createdAt
    }

    public get createTime(): number | undefined {
        if (!this.proposal?.startTime || !this.votingDelay) {
            return undefined
        }

        return (this.proposal.startTime * 1000) - this.votingDelay
    }

    public get startTime(): number | undefined {
        if (!this.proposal?.startTime) {
            return undefined
        }

        return this.proposal.startTime * 1000
    }

    public get queuedAt(): number | undefined {
        if (!this.startTime || !this.votingPeriod) {
            return undefined
        }
        return this.startTime + this.votingPeriod
    }

    public get executedAt(): number | undefined {
        if (!this.queuedAt || !this.timeLock) {
            return undefined
        }
        return this.queuedAt + this.timeLock
    }

    public get gracePeriod(): number | undefined {
        if (!this.proposal?.gracePeriod) {
            return undefined
        }

        return this.proposal.gracePeriod * 1000
    }

    public get votingDelay(): number | undefined {
        if (!this.proposal?.votingDelay) {
            return undefined
        }

        return this.proposal.votingDelay * 1000
    }

    public get timeLock(): number | undefined {
        if (!this.proposal?.timeLock) {
            return undefined
        }

        return this.proposal.timeLock * 1000
    }

    public get votingPeriod(): number | undefined {
        if (!this.proposal?.startTime || !this.proposal?.endTime) {
            return undefined
        }

        return (this.proposal.endTime - this.proposal.startTime) * 1000
    }

    public get executionTime(): number | undefined {
        if (!this.proposal?.executionTime) {
            return undefined
        }

        return this.proposal.executionTime * 1000
    }

}
