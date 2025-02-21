import {
    TvmConnectUI,
    everWallet,
    everscaleNetwork,
    sparxWallet,
} from '@broxus/tvm-connect-ui'
import BigNumber from 'bignumber.js'
import {
    Address,
    type AssetType,
    type FullContractState,
    type Permissions,
    type ProviderRpcClient,
} from 'everscale-inpage-provider'
import {
    makeAutoObservable,
    reaction,
    runInAction,
} from 'mobx'

import { DexConstants } from '@/misc'
import { getFullContractState } from '@/misc/contracts'
import { type WalletNativeCoin } from '@/types'
import { debug, error } from '@/utils'

export type Account = Permissions['accountInteraction']

export type EverWalletServiceCtorOptions = {
    /** Semver dot-notation string */
    minWalletVersion?: string;
}

export class EverWalletService {

    tvmConnectUI = new TvmConnectUI({
        networks: [everscaleNetwork],
        providers: [sparxWallet(), everWallet()],
    })

    protected tvmConnectState = this.tvmConnectUI.getState()

    contract?: FullContractState = undefined

    version?: string = undefined

    constructor(
        protected readonly nativeCoin?: WalletNativeCoin,
        protected readonly options?: EverWalletServiceCtorOptions,
    ) {
        makeAutoObservable(this, {}, { autoBind: true })

        this.tvmConnectUI.subscribe(state => {
            runInAction(() => {
                this.tvmConnectState = state
            })
        })

        reaction(
            () => this.address,
            async () => {
                if (this.address) {
                    getFullContractState(this.address)
                        .then(r => {
                            runInAction(() => {
                                this.contract = r
                            })
                        })
                        .catch(error)
                }
                else {
                    this.contract = undefined
                }
            },
            {
                fireImmediately: true,
            },
        )

        reaction(
            () => this.isReady && this.tvmConnectState.providerId,
            () => {
                const provider = this.tvmConnectUI.getProvider()
                if (provider) {
                    provider.getProviderState().then(r => {
                        runInAction(() => {
                            this.version = r.version
                        })
                    })
                }
                else {
                    this.version = undefined
                }
            },
            {
                fireImmediately: true,
            },
        )
    }

    public async connect(): Promise<void> {
        this.tvmConnectUI.disconnect()
        this.tvmConnectUI.connect(everscaleNetwork)
    }

    public disconnect(): void {
        this.tvmConnectUI.disconnect()
    }

    public getProvider(): ProviderRpcClient | undefined {
        return this.tvmConnectUI.getProvider()
    }

    /**
     * Add custom token asset to the EVER Wallet
     * @param {string} root
     * @param {AssetType} [type]
     */
    public async addAsset(root: string, type: AssetType = 'tip3_token'): Promise<{ newAsset: boolean } | undefined> {
        const rpc = this.getProvider()

        if (this.account?.address === undefined || !rpc) {
            return undefined
        }

        return rpc.addAsset({
            account: this.account.address,
            params: {
                rootContract: new Address(root),
            },
            type,
        })
    }

    /**
     * Returns computed account
     * @returns {EverWalletData['account']}
     */
    public get account(): Permissions['accountInteraction'] | undefined {
        return this.tvmConnectState.account
    }

    /**
     * Returns computed wallet address value
     * @returns {string | undefined}
     */
    public get address(): string | undefined {
        return this.account?.address.toString()
    }

    /**
     * Returns computed wallet balance value
     * @returns {string | undefined}
     */
    public get balance(): string {
        return this.tvmConnectState.balance ?? '0'
    }

    /**
     * Returns computed BigNumber instance of the wallet balance value
     * @returns {BigNumber}
     */
    public get balanceNumber(): BigNumber {
        return new BigNumber(this.balance || 0).shiftedBy(-this.coin.decimals)
    }

    /**
     * Returns base native wallet coin
     * @returns {WalletNativeCoin}
     */
    public get coin(): WalletNativeCoin {
        return {
            balance: this.balance,
            decimals: this.nativeCoin?.decimals ?? 9,
            icon: this.nativeCoin?.icon,
            name: this.nativeCoin?.name,
            symbol: this.nativeCoin?.symbol || 'ever',
        }
    }

    public get networkId(): string | undefined {
        return this.tvmConnectState.networkId?.toString()
    }

    /**
     * Returns `true` if wallet is connected
     * @returns {boolean}
     */
    public get isConnected(): boolean {
        return this.address !== undefined
            && this.tvmConnectState.isUnsupportedNetwork === false
            && this.isReady
    }

    public get isConnecting(): boolean {
        return this.tvmConnectState.isLoading
    }

    public get providerId(): string | undefined {
        return this.tvmConnectState.providerId
    }

    /**
     * Returns `true` if wallet is initializing
     * @returns {boolean}
     */
    public get isInitializing(): boolean {
        return this.tvmConnectState.isInitializing
    }

    /**
     * Returns `true` if installed wallet has outdated version
     */
    public get isOutdated(): boolean {
        if (this.version === undefined || this.options?.minWalletVersion === undefined) {
            return false
        }

        const [
            currentMajorVersion = '0',
            currentMinorVersion = '0',
            currentPatchVersion = '0',
        ] = this.version.split('.')
        const [
            minMajorVersion,
            minMinorVersion,
            minPatchVersion,
        ] = this.options.minWalletVersion.split('.')
        return (
            currentMajorVersion < minMajorVersion
            || (currentMajorVersion <= minMajorVersion && currentMinorVersion < minMinorVersion)
            || (
                currentMajorVersion <= minMajorVersion
                && currentMinorVersion <= minMinorVersion
                && currentPatchVersion < minPatchVersion
            )
        )
    }

    /**
     * Returns `true` if connection to RPC is initialized and connected
     * @returns {boolean}
     */
    public get isReady(): boolean {
        return this.tvmConnectState.isReady
    }

}

let wallet: EverWalletService

export function useEverWallet(): EverWalletService {
    if (wallet === undefined) {
        debug(
            '%cCreated a new one %cEver Wallet Service%c instance as a global service to interact with the EVER Wallet browser extension',
            'color: #c5e4f3',
            'color: #bae701',
            'color: #c5e4f3',
        )
        wallet = new EverWalletService({
            decimals: DexConstants.CoinDecimals,
            name: DexConstants.CoinSymbol,
            symbol: DexConstants.CoinSymbol,
        }, {
            minWalletVersion: DexConstants.MinWalletVersion,
        })
    }
    return wallet
}
