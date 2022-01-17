import ton, { Subscriber } from 'ton-inpage-provider'
import { action, makeAutoObservable, runInAction } from 'mobx'
import BigNumber from 'bignumber.js'

import { AccountDataStore } from '@/modules/Staking/stores/AccountData'
import { ClaimFormState } from '@/modules/Staking/types'
import { TonWalletService } from '@/stores/TonWalletService'
import { getStakingContract } from '@/modules/Staking/utils'
import { error, throwException } from '@/utils'
import { GasToStaking } from '@/config'

export class ClaimFormStore {

    protected state: ClaimFormState = {}

    constructor(
        public readonly accountData: AccountDataStore,
        public readonly tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this, {
            submit: action.bound,
        })
    }

    public async submit(): Promise<void> {
        if (this.state.isLoading) {
            return
        }

        const subscriber = new Subscriber(ton)

        runInAction(() => {
            this.state.isLoading = true
        })

        try {
            await this.accountData.sync()

            if (!this.isValid) {
                throwException('Claim form is not valid')
            }

            if (!this.tonWallet.account?.address) {
                throwException('Ton wallet must be connected')
            }

            const stackingContract = getStakingContract()
            const { tokenWalletBalance } = this.accountData

            const successStream = subscriber
                .transactions(stackingContract.address)
                .flatMap(item => item.transactions)
                .map(transaction => stackingContract.decodeTransaction({
                    transaction,
                    methods: ['finishClaimReward'],
                }))
                .filterMap(result => {
                    if (result?.method === 'finishClaimReward') {
                        if (result.input.user.toString() === this.tonWallet.address) {
                            return true
                        }
                    }
                    return undefined
                })
                .first()

            await stackingContract.methods.claimReward({
                send_gas_to: this.tonWallet.account.address,
            })
                .send({
                    bounce: true,
                    from: this.tonWallet.account.address,
                    amount: GasToStaking,
                })

            await successStream

            while (this.accountData.tokenWalletBalance === tokenWalletBalance) {
                await this.accountData.sync()
                await new Promise(r => setTimeout(r, 1000))
            }
        }
        catch (e) {
            error(e)
        }

        runInAction(() => {
            this.state.isLoading = false
        })
    }

    public get isLoading(): boolean {
        return !!this.state.isLoading
    }

    public get balance(): string | undefined {
        return this.accountData.pendingReward
    }

    public get isValid(): boolean {
        if (!this.balance) {
            return false
        }

        return new BigNumber(this.balance).gt(0)
    }

}
