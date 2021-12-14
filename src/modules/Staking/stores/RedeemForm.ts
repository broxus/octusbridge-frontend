import { action, makeAutoObservable } from 'mobx'
import BigNumber from 'bignumber.js'
import ton, { Address, Subscriber } from 'ton-inpage-provider'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { getStackingContract } from '@/modules/Staking/utils'
import { RedeemFormStoreData, RedeemFormStoreState } from '@/modules/Staking/types'
import { REDEEM_FORM_STORE_DEFAULT_DATA, REDEEM_FORM_STORE_DEFAULT_STATE } from '@/modules/Staking/constants'
import { TonWalletService } from '@/stores/TonWalletService'
import { error, throwException } from '@/utils'
import { GasToStaking } from '@/config'

export class RedeemFormStore {

    public readonly tonDepositAmount = GasToStaking

    protected state: RedeemFormStoreState = REDEEM_FORM_STORE_DEFAULT_STATE

    protected data: RedeemFormStoreData = REDEEM_FORM_STORE_DEFAULT_DATA

    constructor(
        public readonly accountData: AccountDataStore,
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
                throwException('Redeem amount is invalid')
            }

            if (!this.shiftedAmountBN) {
                throwException('Shifted amount must be defined in state')
            }

            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const ownerAddress = new Address(this.tonWallet.address)
            const stackingContract = getStackingContract()

            const successStream = subscriber
                .transactions(stackingContract.address)
                .flatMap(item => item.transactions)
                .map(transaction => stackingContract.decodeTransaction({
                    transaction,
                    methods: ['finishWithdraw'],
                }))
                .filterMap(result => {
                    if (result?.method === 'finishWithdraw') {
                        if (result.input.user.toString() === ownerAddress.toString()) {
                            return true
                        }
                    }

                    return undefined
                })
                .first()

            await stackingContract.methods.withdraw({
                amount: this.shiftedAmountBN.toFixed(),
                send_gas_to: ownerAddress,
            })
                .send({
                    from: ownerAddress,
                    bounce: true,
                    amount: this.tonDepositAmount,
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
        return this.accountData.tokenStakingBalance
    }

    public get amount(): string {
        return this.data.amount
    }

    public get amountBN(): BigNumber {
        return new BigNumber(this.amount)
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
