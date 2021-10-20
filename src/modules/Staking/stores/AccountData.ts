import { action, makeAutoObservable } from 'mobx'
import { Address, Contract } from 'ton-inpage-provider'

import { AccountDataStoreData, AccountDataStoreState } from '@/modules/Staking/types'
import { ACCOUNT_DATA_STORE_DEFAULT_DATA, ACCOUNT_DATA_STORE_DEFAULT_STATE } from '@/modules/Staking/constants'
import { getStackingContract } from '@/modules/Staking/utils'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { UserDataAbi } from '@/misc'
import { error, throwException } from '@/utils'

export class AccountDataStore {

    protected state: AccountDataStoreState = ACCOUNT_DATA_STORE_DEFAULT_STATE

    protected data: AccountDataStoreData = ACCOUNT_DATA_STORE_DEFAULT_DATA

    constructor(
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this, {
            connectToTonWallet: action.bound,
        })
    }

    public async sync(): Promise<void> {
        this.setIsLoading(true)

        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const stackingContract = getStackingContract()

            const { value0: stackingDetails } = await stackingContract.methods.getDetails({
                answerId: 0,
            }).call()

            const { value0: userDataAddress } = await stackingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(this.tonWallet.address),
            }).call()

            const userDataContract = new Contract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            await this.tokensCache.syncTonToken(stackingDetails.tokenRoot.toString())

            this.setData({ stackingDetails, userDetails })
        }
        catch (e) {
            error(e)
        }
        finally {
            this.setIsLoading(false)
        }
    }

    protected setData(data: AccountDataStoreData): void {
        this.data = data
    }

    protected setIsLoading(value: boolean): void {
        this.state.isLoading = value
    }

    public dispose(): void {
        this.state = ACCOUNT_DATA_STORE_DEFAULT_STATE
        this.data = ACCOUNT_DATA_STORE_DEFAULT_DATA
    }

    public connectToTonWallet(): void {
        this.tonWallet.connect()
    }

    public get isLoading(): boolean {
        return this.state.isLoading || this.tonWallet.isConnecting || this.tonWallet.isInitializing
    }

    public get isInitialized(): boolean {
        return this.tonWallet.isInitialized && this.tokensCache.isInitialized
    }

    public get isConnected(): boolean {
        return this.isInitialized && this.tonWallet.isConnected
    }

    public get token(): TokenCache | undefined {
        if (!this.data.stackingDetails) {
            return undefined
        }
        return this.tokensCache.get(this.data.stackingDetails.tokenRoot.toString())
    }

    public get tokenAddress(): string | undefined {
        return this.token?.root
    }

    public get tokenSymbol(): string | undefined {
        return this.token?.symbol
    }

    public get tokenDecimals(): number | undefined {
        return this.token?.decimals
    }

    public get tokenIcon(): string | undefined {
        return this.token?.icon || undefined
    }

    public get tokenWalletBalance(): string {
        return this.token?.balance || '0'
    }

    public get tokenStakingBalance(): string {
        return this.data.userDetails?.token_balance || '0'
    }

    public get stakingTokenWallet(): Address | undefined {
        return this.data.stackingDetails?.tokenWallet
    }

}
