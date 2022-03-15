import { action, makeAutoObservable } from 'mobx'
import BigNumber from 'bignumber.js'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { getStakingContract } from '@/modules/Staking/utils'
import { RedeemFormStoreData, RedeemFormStoreState } from '@/modules/Staking/types'
import { REDEEM_FORM_STORE_DEFAULT_DATA, REDEEM_FORM_STORE_DEFAULT_STATE } from '@/modules/Staking/constants'
import { error, throwException } from '@/utils'
import { GasToStaking } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'

export class RedeemFormStore {

    public readonly tonDepositAmount = GasToStaking

    protected state: RedeemFormStoreState = REDEEM_FORM_STORE_DEFAULT_STATE

    protected data: RedeemFormStoreData = REDEEM_FORM_STORE_DEFAULT_DATA

    constructor(
        public readonly accountData: AccountDataStore,
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
                throwException('Redeem amount is invalid')
            }

            if (!this.gasValid) {
                throwException('Gas amount is invalid')
            }

            if (!this.shiftedAmountBN) {
                throwException('Shifted amount must be defined in state')
            }

            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            const { tokenWalletBalance } = this.accountData
            const stackingContract = getStakingContract()

            const successStream = subscriber
                .transactions(stackingContract.address)
                .flatMap(item => item.transactions)
                .map(transaction => stackingContract.decodeTransaction({
                    transaction,
                    methods: ['finishWithdraw'],
                }))
                .filterMap(result => {
                    if (result?.method === 'finishWithdraw') {
                        if (result.input.user.toString() === this.tonWallet.address) {
                            return true
                        }
                    }

                    return undefined
                })
                .first()

            await stackingContract.methods.withdraw({
                amount: this.shiftedAmountBN.toFixed(),
                send_gas_to: this.tonWallet.account.address,
            })
                .send({
                    bounce: true,
                    from: this.tonWallet.account.address,
                    amount: this.tonDepositAmount,
                })

            await successStream

            while (this.accountData.tokenWalletBalance === tokenWalletBalance) {
                await this.accountData.sync()
                await new Promise(r => setTimeout(r, 1000))
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

    public get hasCastedVotes(): boolean | undefined {
        if (!this.accountData.castedVotes) {
            return undefined
        }

        return this.accountData.castedVotes.length > 0
    }

}
