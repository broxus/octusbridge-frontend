import { action, makeAutoObservable } from 'mobx'
import { Address } from 'everscale-inpage-provider'

import { AccountDataStoreData, AccountDataStoreState } from '@/modules/Staking/types'
import {
    ACCOUNT_DATA_STORE_DEFAULT_DATA, ACCOUNT_DATA_STORE_DEFAULT_STATE,
} from '@/modules/Staking/constants'
import { getStackingContract } from '@/modules/Staking/utils'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { StackingDetails, UserDataAbi, UserDetails } from '@/misc'
import { error, throwException } from '@/utils'
import rpc from '@/hooks/useRpcClient'

export class AccountDataStore {

    protected state: AccountDataStoreState = ACCOUNT_DATA_STORE_DEFAULT_STATE

    protected data: AccountDataStoreData = ACCOUNT_DATA_STORE_DEFAULT_DATA

    protected stackingContract = getStackingContract()

    constructor(
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: TonWalletService,
    ) {
        makeAutoObservable(this, {
            connectToTonWallet: action.bound,
        })
    }

    protected async fetchStackingDetails(): Promise<StackingDetails | undefined> {
        try {
            const { value0: stackingDetails } = await this.stackingContract.methods.getDetails({
                answerId: 0,
            }).call()

            return stackingDetails
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    protected async fetchUserDetails(): Promise<UserDetails | undefined> {
        try {
            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            const { value0: userDataAddress } = await this.stackingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(this.tonWallet.address),
            }).call()

            const userDataContract = rpc.createContract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            return userDetails
        }
        catch (e) {
            error(e)
            return undefined
        }
    }

    public async sync(): Promise<void> {
        this.setIsLoading(true)

        try {
            const stackingDetails = await this.fetchStackingDetails()
            const userDetails = await this.fetchUserDetails()

            if (stackingDetails) {
                await this.tokensCache.syncTonToken(stackingDetails.tokenRoot.toString())
            }

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
