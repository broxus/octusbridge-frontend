import BigNumber from 'bignumber.js'
import { action, makeAutoObservable } from 'mobx'
import { Address } from 'everscale-inpage-provider'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import {
    STAKING_FORM_STORE_DEFAULT_DATA, STAKING_FORM_STORE_DEFAULT_STATE,
    STAKING_PAYLOAD,
} from '@/modules/Staking/constants'
import { getStakingContract } from '@/modules/Staking/utils'
import { StakingFormStoreData, StakingFormStoreState } from '@/modules/Staking/types'
import { TokensCacheService } from '@/stores/TokensCacheService'
import { error, throwException } from '@/utils'
import { GasToStaking } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'

export class StakingFormStore {

    public readonly tonDepositAmount = GasToStaking

    protected state: StakingFormStoreState = STAKING_FORM_STORE_DEFAULT_STATE

    protected data: StakingFormStoreData = STAKING_FORM_STORE_DEFAULT_DATA

    constructor(
        public readonly accountData: AccountDataStore,
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: EverWalletService,
    ) {
        makeAutoObservable(this, {
            setAmount: action.bound,
            setAmountShifted: action.bound,
            submit: action.bound,
        })
    }

    public async submit(): Promise<void> {
        const subscriber = rpc.createSubscriber()

        this.setIsLoading(true)

        try {
            await this.accountData.sync()

            if (!this.amountValid) {
                throwException('Staking amount is invalid')
            }

            if (!this.gasValid) {
                throwException('Gas amount is invalid')
            }

            if (!this.shiftedAmountBN) {
                throwException('Shifted amount must be defined in state')
            }

            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            if (!this.accountData.stakingTokenWallet) {
                throwException('Staking token wallet address must be defined in account data')
            }

            if (!this.accountData.tokenAddress) {
                throwException('Token address must be defined in account data')
            }

            const walletContract = await this.tokensCache.getTokenWalletContract(
                this.accountData.tokenAddress,
            )

            if (!walletContract) {
                throwException('Ton token wallet contract must be defined')
            }

            const ownerAddress = new Address(this.tonWallet.address)
            const { tokenStakingBalance } = this.accountData
            const stackingContract = getStakingContract()

            const successStream = subscriber
                .transactions(stackingContract.address)
                .flatMap(item => item.transactions)
                .flatMap(transaction => stackingContract.decodeTransactionEvents({
                    transaction,
                }))
                .filterMap(result => {
                    if (result.event === 'Deposit') {
                        if (result.data.user.toString() === ownerAddress.toString()) {
                            return true
                        }
                    }

                    return undefined
                })
                .first()

            await walletContract.methods.transferToWallet({
                amount: this.shiftedAmountBN.toFixed(),
                notify: true,
                payload: STAKING_PAYLOAD,
                remainingGasTo: ownerAddress,
                recipientTokenWallet: this.accountData.stakingTokenWallet,
            })
                .send({
                    from: ownerAddress,
                    amount: this.tonDepositAmount,
                    bounce: false,
                })

            await successStream

            while (this.accountData.tokenStakingBalance === tokenStakingBalance) {
                await this.accountData.sync()
                await new Promise(r => {
                    setTimeout(r, 1000)
                })
            }

            this.setAmount('')
        }
        catch (e) {
            await subscriber.unsubscribe()
            error(e)
        }
        finally {
            this.setIsLoading(false)
        }
    }

    public setIsLoading(value: boolean): void {
        this.state.isLoading = value
    }

    public setAmount(value: string): void {
        this.data.amount = value
    }

    public setAmountShifted(value: string): void {
        if (!this.accountData.tokenDecimals || !value) {
            return
        }

        const amount = new BigNumber(value)
            .shiftedBy(-this.accountData.tokenDecimals)
            .toFixed()

        this.setAmount(amount)
    }

    public get isLoading(): boolean {
        return this.state.isLoading
    }

    public get balance(): string | undefined {
        return this.accountData.tokenWalletBalance
    }

    public get amount(): string {
        return this.data.amount
    }

    public get amountBN(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get shiftedAmountBN(): BigNumber | undefined {
        return this.accountData.tokenDecimals !== undefined
            ? this.amountBN.shiftedBy(this.accountData.tokenDecimals)
            : undefined
    }

    public get amountValid(): boolean {
        if (!this.balance) {
            return false
        }

        if (this.amountBN.lte(0)) {
            return false
        }

        if (!this.shiftedAmountBN) {
            return false
        }

        return this.shiftedAmountBN.lte(this.balance)
    }

    public get gasValid(): boolean {
        if (!this.tonWallet.balance) {
            return false
        }

        return new BigNumber(this.tonWallet.balance).gte(this.tonDepositAmount)
    }

}
