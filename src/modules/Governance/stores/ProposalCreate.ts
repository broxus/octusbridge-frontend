import { Address } from 'everscale-inpage-provider'
import { makeAutoObservable } from 'mobx'
import BigNumber from 'bignumber.js'

import {
    EthAction, ProposalCreateStoreState, TonAction,
} from '@/modules/Governance/types'
import { UserDataStore } from '@/modules/Governance/stores/UserData'
import { DaoConfigStore } from '@/modules/Governance/stores/DaoConfig'
import { DaoAbi, DexConstants } from '@/misc'
import { DaoRootContractAddress } from '@/config'
import { error, throwException } from '@/utils'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'
import { TokenCache } from '@/types'

export class ProposalCreateStore {

    protected state: ProposalCreateStoreState = {}

    constructor(
        protected tonWallet: EverWalletService,
        protected userData: UserDataStore,
        protected daoConfig: DaoConfigStore,
    ) {
        makeAutoObservable(this)
    }

    public init(): void {
        this.userData.init()
        this.daoConfig.init()
    }

    public dispose(): void {
        this.daoConfig.dispose()
        this.userData.dispose()
        this.state = {}
    }

    public async submit(
        description: string,
        _tonActions: TonAction[],
        _ethActions: EthAction[],
    ): Promise<string | undefined> {
        this.setState('createLoading', true)

        let proposalId
        const subscriber = rpc.createSubscriber()

        try {
            const userAddress = this.tonWallet.account?.address

            if (!userAddress) {
                throwException('Ton wallet must be connected')
            }

            const tonActions = _tonActions.map(item => ({
                ...item,
                payload: item.payload,
                value: new BigNumber(item.value)
                    .shiftedBy(DexConstants.CoinDecimals)
                    .decimalPlaces(0)
                    .toFixed(),
                target: new Address(item.target),
            }))

            const ethActions = _ethActions.map(item => ({
                ...item,
                callData: item.callData,
            }))

            const daoContract = rpc.createContract(DaoAbi.Root, DaoRootContractAddress)

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

    protected setState<K extends keyof ProposalCreateStoreState>(key: K, value: ProposalCreateStoreState[K]): void {
        this.state[key] = value
    }

    public get isConnected(): boolean {
        return this.userData.isConnected && this.tonWallet.isConnected
    }

    public get createLoading(): boolean {
        return !!this.state.createLoading
    }

    public get token(): TokenCache | undefined {
        return this.userData.token
    }

    public get canCreate(): boolean | undefined {
        if (
            this.userData.hasAccount === undefined
            || this.daoConfig.threshold === undefined
        ) {
            return undefined
        }

        if (this.userData.hasAccount === false) {
            return false
        }

        if (
            this.userData.tokenBalance === undefined
            || this.userData.lockedTokens === undefined
        ) {
            return false
        }

        return new BigNumber(this.userData.tokenBalance)
            .minus(this.userData.lockedTokens)
            .gte(this.daoConfig.threshold)
    }

    public get tokenMissing(): string | undefined {
        if (
            !this.userData.tokenBalance
            || !this.userData.lockedTokens
            || !this.daoConfig.threshold
            || !this.token
        ) {
            return undefined
        }

        const actualBalanceBN = new BigNumber(this.userData.tokenBalance)
            .minus(this.userData.lockedTokens)

        return new BigNumber(this.daoConfig.threshold)
            .minus(actualBalanceBN)
            .toFixed()
    }

    public get threshold(): string | undefined {
        return this.daoConfig.threshold
    }

    public get hasLockedTokens(): boolean | undefined {
        if (!this.userData.lockedTokens) {
            return undefined
        }

        return new BigNumber(this.userData.lockedTokens).gt(0)
    }

    public get lockedTokens(): string | undefined {
        return this.userData.lockedTokens
    }

}
