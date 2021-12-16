import ton, { Address, Contract, Subscriber } from 'ton-inpage-provider'
import { makeAutoObservable } from 'mobx'
import BigNumber from 'bignumber.js'

import {
    EthAction, ProposalCreateStoreData, ProposalCreateStoreState, TonAction,
} from '@/modules/Governance/types'
import { TokenCache } from '@/stores/TokensCacheService'
import { UserDataStore } from '@/modules/Governance/stores/UserData'
import { TonWalletService } from '@/stores/TonWalletService'
import { DaoAbi } from '@/misc'
import { DaoRootContractAddress } from '@/config'
import { error, throwException } from '@/utils'

export class ProposalCreateStore {

    protected data: ProposalCreateStoreData = {}

    protected state: ProposalCreateStoreState = {}

    constructor(
        protected tonWallet: TonWalletService,
        protected userData: UserDataStore,
    ) {
        makeAutoObservable(this)
    }

    public dispose(): void {
        this.state = {}
        this.data = {}
    }

    protected async syncConfig(): Promise<void> {
        try {
            const daoContract = new Contract(DaoAbi.Root, DaoRootContractAddress)
            const { proposalConfiguration } = await daoContract.methods.proposalConfiguration({}).call()
            this.setData('config', proposalConfiguration)
        }
        catch (e) {
            error(e)
        }
    }

    public async fetch(): Promise<void> {
        this.setState('loading', true)
        try {
            await this.syncConfig()
            await this.userData.sync()
        }
        catch (e) {
            error(e)
        }
        this.setState('loading', false)
    }

    public async submit(
        description: string,
        _tonActions: TonAction[],
        _ethActions: EthAction[],
    ): Promise<string | undefined> {
        this.setState('createLoading', true)

        let proposalId
        const subscriber = new Subscriber(ton)

        try {
            const userAddress = this.tonWallet.account?.address

            if (!userAddress) {
                throwException('Ton wallet must be connected')
            }

            const tonActions = _tonActions.map(item => ({
                ...item,
                payload: item.payload, // TODO: Fix
                target: new Address(item.target),
            }))

            const ethActions = _ethActions.map(item => ({
                ...item,
                callData: item.callData, // TODO: Encode
            }))

            const daoContract = new Contract(DaoAbi.Root, DaoRootContractAddress)

            const { totalValue: tonActionsValue } = await daoContract.methods.calcTonActionsValue({
                actions: tonActions,
            }).call()

            const { totalValue: ethActionsValue } = await daoContract.methods.calcEthActionsValue({
                actions: ethActions,
            }).call()

            const proposalIdStream = subscriber
                .transactions(daoContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => daoContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'ProposalCreated') {
                        if (result.data.proposer.toString() === userAddress.toString()) {
                            return result.data.proposalId
                        }
                    }
                    return undefined
                })
                .first()

            await daoContract.methods.propose({
                description,
                ethActions,
                tonActions,
                answerId: 0,
            }).send({
                from: userAddress,
                amount: new BigNumber('10000000000')
                    .plus(tonActionsValue)
                    .plus(ethActionsValue)
                    .toFixed(),
            })

            proposalId = await proposalIdStream
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }

        this.setState('createLoading', false)

        return proposalId
    }

    protected setData<K extends keyof ProposalCreateStoreData>(key: K, value: ProposalCreateStoreData[K]): void {
        this.data[key] = value
    }

    protected setState<K extends keyof ProposalCreateStoreState>(key: K, value: ProposalCreateStoreState[K]): void {
        this.state[key] = value
    }

    public get connected(): boolean {
        return this.userData.connected && this.tonWallet.isConnected
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

    public get createLoading(): boolean {
        return !!this.state.createLoading
    }

    public get token(): TokenCache | undefined {
        return this.userData.token
    }

    public get canCreate(): boolean | undefined {
        if (!this.userData.tokenBalance || !this.userData.lockedTokens || !this.data.config) {
            return undefined
        }

        return new BigNumber(this.userData.tokenBalance)
            .minus(this.userData.lockedTokens)
            .gte(this.data.config.threshold)
    }

    public get tokenMissing(): string | undefined {
        if (
            !this.userData.tokenBalance
            || !this.userData.lockedTokens
            || !this.data.config
            || !this.token
        ) {
            return undefined
        }

        const actualBalanceBN = new BigNumber(this.userData.tokenBalance)
            .minus(this.userData.lockedTokens)

        return new BigNumber(this.data.config.threshold)
            .minus(actualBalanceBN)
            .toFixed()
    }

}
