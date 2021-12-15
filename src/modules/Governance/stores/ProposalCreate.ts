import ton, { Address, Contract, Subscriber } from 'ton-inpage-provider'
import { makeAutoObservable } from 'mobx'
import BigNumber from 'bignumber.js'

import {
    EthAction, ProposalCreateStoreData, ProposalCreateStoreState, TonAction,
} from '@/modules/Governance/types'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import {
    BridgeConstants, DaoAbi, ProposalConfig, StackingAbi,
    StackingDetails, UserDataAbi, UserDetails,
} from '@/misc'
import { DaoRootContractAddress } from '@/config'
import { error, throwException } from '@/utils'

export class ProposalCreateStore {

    protected data: ProposalCreateStoreData = {}

    protected state: ProposalCreateStoreState = {}

    constructor(
        protected tonWallet: TonWalletService,
        protected tokensCache: TokensCacheService,
    ) {
        makeAutoObservable(this)
    }

    public dispose(): void {
        this.state = {}
        this.data = {}
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

    protected async syncUserData(): Promise<void> {
        try {
            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            const stakingContract = new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)

            const { value0: userDataAddress } = await stakingContract.methods.getUserDataAddress({
                answerId: 0,
                user: this.tonWallet.account?.address,
            }).call()

            const userDataContract = new Contract(UserDataAbi.Root, userDataAddress)

            const { value0: lockedTokens } = await userDataContract.methods.lockedTokens({
                answerId: 0,
            }).call()

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            const { value0: stakingDetails } = await stakingContract.methods.getDetails({
                answerId: 0,
            }).call()

            this.setUserData(lockedTokens, userDetails)
            this.setStakingDetails(stakingDetails)
        }
        catch (e) {
            error(e)
        }
    }

    protected async syncConfig(): Promise<void> {
        try {
            const daoContract = new Contract(DaoAbi.Root, DaoRootContractAddress)

            const { proposalConfiguration } = await daoContract.methods.proposalConfiguration({}).call()

            this.setConfig(proposalConfiguration)
        }
        catch (e) {
            error(e)
        }
    }

    public async fetch(): Promise<void> {
        this.setLoading(true)

        try {
            await this.syncConfig()
            await this.syncUserData()
            await this.syncToken()
        }
        catch (e) {
            error(e)
        }

        this.setLoading(false)
    }

    public async submit(
        description: string,
        _tonActions: TonAction[],
        _ethActions: EthAction[],
    ): Promise<string | undefined> {
        this.setCreateLoading(true)

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

        this.setCreateLoading(false)

        return proposalId
    }

    protected setConfig(config: ProposalConfig): void {
        this.data.config = config
    }

    protected setUserData(lockedTokens: string, userDetails: UserDetails): void {
        this.data.lockedTokens = lockedTokens
        this.data.userDetails = userDetails
    }

    protected setStakingDetails(stakingDetails: StackingDetails): void {
        this.data.stakingDetails = stakingDetails
    }

    protected setLoading(loading: boolean): void {
        this.state.loading = loading
    }

    protected setCreateLoading(loading: boolean): void {
        this.state.createLoading = loading
    }

    public get connected(): boolean {
        return this.tokensCache.isInitialized && this.tonWallet.isConnected
    }

    public get loading(): boolean {
        return !!this.state.loading
    }

    public get createLoading(): boolean {
        return !!this.state.createLoading
    }

    public get token(): TokenCache | undefined {
        if (!this.data.stakingDetails) {
            return undefined
        }

        return this.tokensCache.get(this.data.stakingDetails.tokenRoot.toString())
    }

    public get canCreate(): boolean | undefined {
        if (!this.data.userDetails?.token_balance || !this.data.lockedTokens || !this.data.config) {
            return undefined
        }

        return new BigNumber(this.data.userDetails?.token_balance)
            .minus(this.data.lockedTokens)
            .gte(this.data.config.threshold)
    }

    public get tokenMissing(): string | undefined {
        if (
            !this.data.userDetails?.token_balance
            || !this.data.lockedTokens
            || !this.data.config
            || !this.token
        ) {
            return undefined
        }

        const actualBalanceBN = new BigNumber(this.data.userDetails.token_balance)
            .minus(this.data.lockedTokens)

        return new BigNumber(this.data.config.threshold)
            .minus(actualBalanceBN)
            .toFixed()
    }

}
