import {
    action, computed,
    makeObservable,
    reaction,
    runInAction,
} from 'mobx'
import {
    Address,
    AssetType,
    ContractState,
    FullContractState,
    hasEverscaleProvider,
    Permissions,
    Subscription,
    Transaction,
} from 'everscale-inpage-provider'

import rpc from '@/hooks/useRpcClient'
import { DexConstants } from '@/misc'
import { BaseStore } from '@/stores/BaseStore'
import { debug, error } from '@/utils'


export type Account = Permissions['accountInteraction']

export type EverWalletData = {
    account?: Account;
    balance: string;
    contract?: ContractState | FullContractState;
    transaction?: Transaction;
    version?: string;
}

export type EverWalletState = {
    hasProvider: boolean;
    isConnecting: boolean;
    isInitialized: boolean;
    isInitializing: boolean;
    isUpdatingContract: boolean;
}


const DEFAULT_WALLET_DATA: EverWalletData = {
    account: undefined,
    balance: '0',
    contract: undefined,
    transaction: undefined,
}

const DEFAULT_WALLET_STATE: EverWalletState = {
    hasProvider: false,
    isConnecting: false,
    isInitialized: false,
    isInitializing: false,
    isUpdatingContract: false,
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

    constructor() {
        super()

        this.data = DEFAULT_WALLET_DATA
        this.state = DEFAULT_WALLET_STATE

        this.#contractSubscriber = undefined

        makeObservable(this, {
            connect: action.bound,
            disconnect: action.bound,
            address: computed,
            balance: computed,
            hasProvider: computed,
            isConnected: computed,
            isConnecting: computed,
            isInitialized: computed,
            isInitializing: computed,
            isReady: computed,
            isOutdated: computed,
            isUpdatingContract: computed,
            account: computed,
            contract: computed,
            transaction: computed,
        })

        reaction(
            () => this.contract?.balance,
            balance => {
                this.setData('balance', balance || '0')
            },
        )

        reaction(
            () => this.account,
            (account, prevAccount) => {
                if (prevAccount?.address?.toString() === account?.address?.toString()) {
                    this.setState('isConnecting', false)
                    return
                }

                this.handleAccountChange(account).then(() => {
                    this.setState('isConnecting', false)
                })
            },
        )

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
        if (this.isConnecting) {
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
            this.setState('isConnecting', false)
        }
        catch (e) {
            error('Wallet connect error', e)
            this.setState('isConnecting', false)
        }
    }

    /**
     * Manually disconnect from the wallet
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        if (this.isConnecting) {
            return
        }

        this.setState('isConnecting', true)

        try {
            await rpc.disconnect()
            this.reset()
        }
        catch (e) {
            error('Wallet disconnect error', e)
            this.setState('isConnecting', false)
        }
    }

    /**
     * Add custom token asset to the EVER Wallet
     * @param {string} root
     * @param {AssetType} type
     */
    public async addAsset(root: string, type: AssetType = 'tip3_token'): Promise<void> {
        if (this.account?.address === undefined) {
            return
        }
        await rpc.addAsset({
            account: this.account.address,
            params: {
                rootContract: new Address(root),
            },
            type,
        })
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
     * Check if connection to EVER Wallet is complete and ready to use it
     */
    public get isReady(): boolean {
        return (
            !this.isInitializing
            && !this.isConnecting
            && this.isInitialized
            && this.isConnected
        )
    }

    /**
     * Returns `true` if installed wallet has outdated version
     */
    public get isOutdated(): boolean {
        if (this.data.version === undefined) {
            return false
        }

        const [
            currentMajorVersion = '0',
            currentMinorVersion = '0',
            currentPatchVersion = '0',
        ] = this.data.version.split('.')
        const [minMajorVersion, minMinorVersion, minPatchVersion] = DexConstants.MinWalletVersion.split('.')
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
     * Returns `true` if wallet contract is updating
     * @returns {boolean}
     */
    public get isUpdatingContract(): EverWalletState['isUpdatingContract'] {
        return this.state.isUpdatingContract
    }

    /**
     * Returns computed account
     * @returns {EverWalletData['account']}
     */
    public get account(): EverWalletData['account'] {
        return this.data.account
    }

    /**
     * Returns computed wallet contract state
     * @returns {EverWalletData['contract']}
     */
    public get contract(): EverWalletData['contract'] {
        return this.data.contract
    }

    /**
     * Returns computed last successful transaction data
     * @returns {EverWalletData['transaction']}
     */
    public get transaction(): EverWalletData['transaction'] {
        return this.data.transaction
    }

    /**
     * Wallet initializing. It runs
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

        this.setState({
            isInitializing: false,
            isInitialized: true,
            isConnecting: true,
        })

        const permissionsSubscriber = await rpc.subscribe('permissionsChanged')
        permissionsSubscriber.on('data', event => {
            this.setData('account', event.permissions.accountInteraction)
        })

        const currentProviderState = await rpc.getProviderState()

        if (currentProviderState.permissions.accountInteraction === undefined) {
            this.setState('isConnecting', false)
            return
        }

        this.setData('version', currentProviderState.version)
        this.setState('isConnecting', true)

        await connectToWallet()

        this.setState('isConnecting', false)
    }

    /**
     * Reset wallet data to defaults
     * @protected
     */
    protected reset(): void {
        this.data = DEFAULT_WALLET_DATA
        this.setState('isConnecting', false)
    }

    /**
     * Internal callback to subscribe for contract and transactions updates.
     *
     * Run it when account was changed or disconnected.
     * @param {Account} [account]
     * @returns {Promise<void>}
     * @protected
     */
    protected async handleAccountChange(account?: Account): Promise<void> {
        if (this.#contractSubscriber !== undefined) {
            if (account !== undefined) {
                try {
                    await this.#contractSubscriber.unsubscribe()
                }
                catch (e) {
                    error(e)
                }
            }
            this.#contractSubscriber = undefined
        }

        if (account === undefined) {
            return
        }

        this.setState('isUpdatingContract', true)

        try {
            const { state } = await rpc.getFullContractState({
                address: account.address,
            })

            runInAction(() => {
                this.setData('contract', state)
                this.setState('isUpdatingContract', false)
            })
        }
        catch (e) {
            error('Get account full contract state error', e)
        }
        finally {
            this.setState('isUpdatingContract', false)
        }

        try {
            this.#contractSubscriber = await rpc.subscribe(
                'contractStateChanged',
                { address: account.address },
            )

            this.#contractSubscriber.on('data', event => {
                debug(
                    '%cTON Provider%c The wallet\'s `contractStateChanged` event was captured',
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    event,
                )

                this.setData('contract', event.state)
            })
        }
        catch (e) {
            error(e)
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


const Wallet = new EverWalletService()

export function useEverWallet(): EverWalletService {
    return Wallet
}
