import { makeAutoObservable, toJS } from 'mobx'
import ton, { Address, Contract, Subscriber } from 'ton-inpage-provider'

import {
    Description, EthAction, Proposal, ProposalsRequest,
    ProposalsResponse, ProposalState, ProposalStoreData,
    ProposalStoreState, TonAction,
} from '@/modules/Governance/types'
import { handleProposals, parseDescription } from '@/modules/Governance/utils'
import { TonWalletService } from '@/stores/TonWalletService'
import { ProposalAbi } from '@/misc'
import {
    error, lastOfCalls, throwException, validateUrl,
} from '@/utils'

export class ProposalStore {

    protected data: ProposalStoreData = {}

    protected _state: ProposalStoreState = {}

    protected handleProposals: (params: ProposalsRequest) => Promise<ProposalsResponse | undefined>

    constructor(
        protected tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this)

        this.handleProposals = lastOfCalls(handleProposals)
    }

    public async sync(proposalId: number): Promise<void> {
        try {
            const response = await this.handleProposals({
                proposalId,
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

    public async fetch(proposalId: number): Promise<void> {
        if (this._state.loading) {
            return
        }

        this.setLoading(true)

        try {
            await this.sync(proposalId)
        }
        catch (e) {
            error(e)
        }

        this.setLoading(false)
    }

    public async cancel(): Promise<void> {
        this.setCancelLoading(true)

        const subscriber = new Subscriber(ton)

        try {
            if (!this.id) {
                throwException('Proposal id must be defined in data')
            }

            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            if (!this.contractAddress) {
                throwException('Contract address must be defined in data')
            }

            const proposalContract = new Contract(ProposalAbi.Root, new Address(this.contractAddress))

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
                await this.sync(this.id)
                await new Promise(r => setTimeout(r, 2000))
            }
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setCancelLoading(false)
    }

    protected setLoading(loading: boolean): void {
        this._state.loading = loading
    }

    protected setCancelLoading(loading: boolean): void {
        this._state.cancelLoading = loading
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
        return !!this._state.loading
    }

    public get cancelLoading(): boolean {
        return !!this._state.cancelLoading
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
        return this.proposal?.endTime
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

    public get contractAddress(): string | undefined {
        return this.proposal?.contractAddress
    }

    public get createdAt(): number | undefined {
        return this.proposal?.createdAt
    }

    public get startTime(): number | undefined {
        return this.proposal?.startTime
    }

    public get queuedAt(): number | undefined {
        return this.proposal?.queuedAt
    }

    public get executedAt(): number | undefined {
        return this.proposal?.executedAt
    }

    public get gracePeriod(): number | undefined {
        return this.proposal?.gracePeriod
            ? this.proposal?.gracePeriod * 1000
            : undefined
    }

    public get votingDelay(): number | undefined {
        return this.proposal?.createdAt && this.proposal.startTime
            ? this.proposal.startTime - this.proposal.createdAt
            : undefined
    }

    public get timeLock(): number | undefined {
        return this.proposal?.queuedAt && this.proposal.executedAt
            ? this.proposal.executedAt - this.proposal.queuedAt
            : undefined
    }

    public get votingPeriod(): number | undefined {
        return this.proposal?.startTime && this.proposal.queuedAt
            ? this.proposal.queuedAt - this.proposal?.startTime
            : undefined
    }

}
