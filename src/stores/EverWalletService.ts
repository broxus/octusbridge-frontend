import BigNumber from 'bignumber.js'
import {
    Address,
    AssetType,
    ContractState,
    FullContractState,
    hasEverscaleProvider,
    Permissions,
    Subscription,
} from 'everscale-inpage-provider'
import {
    action,
    computed,
    makeObservable,
    reaction,
} from 'mobx'

import rpc from '@/hooks/useRpcClient'
import { DexConstants } from '@/misc'
import { BaseStore } from '@/stores/BaseStore'
import { debug, error } from '@/utils'
import type { WalletNativeCoin } from '@/types'


export type Account = Permissions['accountInteraction']

export type EverWalletData = {
    account?: Account;
    balance: string;
    contract?: ContractState | FullContractState;
    version?: string;
}

export type EverWalletState = {
    hasProvider: boolean;
    isConnecting: boolean;
    isContractUpdating: boolean;
    isDisconnecting: boolean;
    isInitialized: boolean;
    isInitializing: boolean;
}

export type EverWalletServiceCtorOptions = {
    /** Semver dot-notation string */
    minWalletVersion?: string;
}


const DEFAULT_WALLET_DATA: EverWalletData = {
    account: undefined,
    balance: '0',
    contract: undefined,
}

const DEFAULT_WALLET_STATE: EverWalletState = {
    hasProvider: false,
    isConnecting: false,
    isContractUpdating: false,
    isDisconnecting: false,
    isInitialized: false,
    isInitializing: false,
}

export async function connectToWallet(): Promise<void> {
    const hasProvider = await hasEverscaleProvider()

    if (hasProvider) {
        await rpc.ensureInitialized()
        await rpc.requestPermissions({
            permissions: ['basic', 'accountInteraction'],
        })
    }
}


export class EverWalletService extends BaseStore<EverWalletData, EverWalletState> {

    constructor(
        protected readonly nativeCoin?: WalletNativeCoin,
        protected readonly options?: EverWalletServiceCtorOptions,
    ) {
        super()

        this.#contractSubscriber = undefined

        this.setData(() => DEFAULT_WALLET_DATA)

        this.setState(() => DEFAULT_WALLET_STATE)

        makeObservable(this, {
            account: computed,
            address: computed,
            balance: computed,
            balanceNumber: computed,
            coin: computed,
            connect: action.bound,
            contract: computed,
            disconnect: action.bound,
            hasProvider: computed,
            isConnected: computed,
            isConnecting: computed,
            isContractUpdating: computed,
            isDisconnecting: computed,
            isInitialized: computed,
            isInitializing: computed,
            isOutdated: computed,
            isReady: computed,
        })

        reaction(
            () => this.contract?.balance,
            balance => {
                this.setData('balance', balance || '0')
            },
            { fireImmediately: true },
        )

        reaction(
            () => this.account,
            async (account, prevAccount) => {
                if (prevAccount?.address?.toString() === account?.address?.toString()) {
                    this.setState('isConnecting', false)
                    return
                }

                try {
                    await this.onAccountChange(account)
                }
                catch (e) {}
                finally {
                    this.setState('isConnecting', false)
                }
            },
            { fireImmediately: true },
        )

        // TODO Make interval for check wallet installation
        this.init().catch(reason => {
            error('Wallet init error', reason)
            this.setState('isConnecting', false)
        })
    }

    /**
     * Manually connect to the wallet
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        if (this.isConnecting || this.isDisconnecting) {
            return
        }

        this.setState('isConnecting', true)

        try {
            const hasProvider = await hasEverscaleProvider()
            this.setState('hasProvider', hasProvider)
        }
        catch (e) {
            this.setState('hasProvider', false)
            return
        }

        if (!this.hasProvider) {
            return
        }

        try {
            await connectToWallet()
        }
        catch (e) {
            error('Wallet connect error', e)
        }
        finally {
            this.setState('isConnecting', false)
        }
    }

    /**
     * Manually disconnect from the wallet
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        if (this.isConnecting || this.isDisconnecting) {
            return
        }

        this.setState('isDisconnecting', true)

        try {
            await rpc.disconnect()
            this.reset()
        }
        catch (e) {
            error('Wallet disconnect error', e)
        }
        finally {
            this.setState('isDisconnecting', false)
        }
    }

    /**
     * Add custom token asset to the EVER Wallet
     * @param {string} root
     * @param {AssetType} [type]
     */
    public async addAsset(root: string, type: AssetType = 'tip3_token'): Promise<{ newAsset: boolean } | undefined> {
        if (this.account?.address === undefined) {
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
    public get account(): EverWalletData['account'] {
        return this.data.account
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
    public get balance(): EverWalletData['balance'] {
        return this.data.balance
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

    /**
     * Returns computed wallet contract state
     * @returns {EverWalletData['contract']}
     */
    public get contract(): EverWalletData['contract'] {
        return this.data.contract
    }

    /**
     * Returns `true` if provider is available.
     * That means extension is installed and activated, else `false`
     * @returns {boolean}
     */
    public get hasProvider(): EverWalletState['hasProvider'] {
        return this.state.hasProvider
    }

    /**
     * Returns `true` if wallet is connected
     * @returns {boolean}
     */
    public get isConnected(): boolean {
        return this.address !== undefined
    }

    /**
     * Returns `true` if wallet is connecting
     * @returns {boolean}
     */
    public get isConnecting(): EverWalletState['isConnecting'] {
        return this.state.isConnecting
    }

    /**
     * Returns `true` if wallet contract is updating
     * @returns {boolean}
     */
    public get isContractUpdating(): EverWalletState['isContractUpdating'] {
        return this.state.isContractUpdating
    }

    /**
     * Returns `true` if wallet is disconnecting
     * @returns {boolean}
     */
    public get isDisconnecting(): EverWalletState['isDisconnecting'] {
        return this.state.isDisconnecting
    }

    /**
     * Returns `true` if wallet is initialized
     * @returns {boolean}
     */
    public get isInitialized(): EverWalletState['isInitialized'] {
        return this.state.isInitialized
    }

    /**
     * Returns `true` if wallet is initializing
     * @returns {boolean}
     */
    public get isInitializing(): EverWalletState['isInitializing'] {
        return this.state.isInitializing
    }

    /**
     * Returns `true` if installed wallet has outdated version
     */
    public get isOutdated(): boolean {
        if (this.data.version === undefined || this.options?.minWalletVersion === undefined) {
            return false
        }

        const [
            currentMajorVersion = '0',
            currentMinorVersion = '0',
            currentPatchVersion = '0',
        ] = this.data.version.split('.')
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
        return (
            !this.isInitializing
            && !this.isConnecting
            && !this.isDisconnecting
            && this.isInitialized
            && this.isConnected
        )
    }

    /**
     * Trying to resolve EVER Wallet connection
     * @returns {Promise<void>}
     * @protected
     */
    protected async init(): Promise<void> {
        this.setState('isInitializing', true)

        let hasProvider = false

        try {
            hasProvider = await hasEverscaleProvider()
        }
        catch (e) {}

        if (!hasProvider) {
            this.setState({
                hasProvider: false,
                isInitializing: false,
            })
            return
        }

        this.setState('hasProvider', hasProvider)

        try {
            await rpc.ensureInitialized()
        }
        catch (e) {
            return
        }

        this.setState('isConnecting', true)

        const permissionsSubscriber = await rpc.subscribe('permissionsChanged')
        permissionsSubscriber.on('data', event => {
            this.setData('account', event.permissions.accountInteraction)
        })

        const currentProviderState = await rpc.getProviderState()

        if (currentProviderState.permissions.accountInteraction === undefined) {
            this.setState({
                isConnecting: false,
                isInitialized: true,
                isInitializing: false,
            })
            return
        }

        this.setData('version', currentProviderState.version)

        await connectToWallet()

        this.setState({
            isConnecting: false,
            isInitialized: true,
            isInitializing: false,
        })
    }

    /**
     * Reset wallet data to defaults
     * @protected
     */
    protected reset(): void {
        this.setData(() => DEFAULT_WALLET_DATA)
    }

    /**
     * Internal callback to subscribe for contract and transactions updates.
     *
     * Run it when account was changed or disconnected.
     * @param {Account} [account]
     * @returns {Promise<void>}
     * @protected
     */
    protected async onAccountChange(account?: Account): Promise<void> {
        if (this.#contractSubscriber !== undefined) {
            if (account !== undefined) {
                try {
                    await this.#contractSubscriber.unsubscribe()
                }
                catch (e) {
                    error('Wallet contract unsubscribe error', e)
                }
            }
            this.#contractSubscriber = undefined
        }

        if (account === undefined) {
            return
        }

        this.setState('isContractUpdating', true)

        try {
            const { state } = await rpc.getFullContractState({
                address: account.address,
            })

            this.setData('contract', state)
            this.setState('isContractUpdating', false)
        }
        catch (e) {
            error('Get account full contract state error', e)
        }
        finally {
            this.setState('isContractUpdating', false)
        }

        try {
            this.#contractSubscriber = await rpc.subscribe(
                'contractStateChanged',
                { address: account.address },
            )

            this.#contractSubscriber.on('data', event => {
                debug(
                    '%cRPC%c The wallet\'s `contractStateChanged` event was captured',
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    event,
                )

                this.setData('contract', event.state)
            })
        }
        catch (e) {
            error('Contract subscribe error', e)
            this.#contractSubscriber = undefined
        }
    }

    /**
     * Internal instance of the Ton Subscription for Contract updates
     * @type {Subscription<'contractStateChanged'> | undefined}
     * @protected
     */
    #contractSubscriber: Subscription<'contractStateChanged'> | undefined

}


let wallet: EverWalletService

export function useEverWallet(): EverWalletService {
    if (wallet === undefined) {
        debug(
            '%cCreated a new one Web3WalletService instance as global service to interact with the Web3 Wallet browser extension',
            'color: #bae701',
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
