import BigNumber from 'bignumber.js'
import { action, makeAutoObservable } from 'mobx'
import ton, { Address, Subscriber } from 'ton-inpage-provider'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import {
    STAKING_FORM_STORE_DEFAULT_DATA, STAKING_FORM_STORE_DEFAULT_STATE,
    STAKING_PAYLOAD,
} from '@/modules/Staking/constants'
import { getStackingContract } from '@/modules/Staking/utils'
import { StakingFormStoreData, StakingFormStoreState } from '@/modules/Staking/types'
import { TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { error, throwException } from '@/utils'
import { GasToStaking } from '@/config'

export class StakingFormStore {

    public readonly tonDepositAmount = GasToStaking

    protected state: StakingFormStoreState = STAKING_FORM_STORE_DEFAULT_STATE

    protected data: StakingFormStoreData = STAKING_FORM_STORE_DEFAULT_DATA

    constructor(
        public readonly accountData: AccountDataStore,
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this, {
            setAmount: action.bound,
            submit: action.bound,
        })
    }

    public async submit(): Promise<void> {
        const subscriber = new Subscriber(ton)

        this.setIsLoading(true)

        try {
            await this.accountData.sync()

            if (!this.isValid) {
                throwException('Staking amount is invalid')
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

            const walletContract = await this.tokensCache.getTonTokenWalletContract(
                this.accountData.tokenAddress,
            )

            if (!walletContract) {
                throwException('Ton token wallet contract must be defined')
            }

            const ownerAddress = new Address(this.tonWallet.address)
            const stackingContract = getStackingContract()

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

            await walletContract.methods.transfer({
                tokens: this.shiftedAmountBN.toFixed(),
                to: this.accountData.stakingTokenWallet,
                payload: STAKING_PAYLOAD,
                notify_receiver: true,
                send_gas_to: ownerAddress,
                grams: 0,
            })
                .send({
                    from: ownerAddress,
                    amount: this.tonDepositAmount,
                    bounce: false,
                })

            await successStream
            await this.accountData.sync()
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

    public get isLoading(): boolean {
        return this.state.isLoading
    }

    public get balance(): string {
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

    public get isValid(): boolean {
        if (new BigNumber(this.tonWallet.balance).lt(this.tonDepositAmount)) {
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

}
