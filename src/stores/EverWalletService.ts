import {
    action,
    makeAutoObservable,
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
import { debug, error } from '@/utils'


export type Account = Permissions['accountInteraction']

export type EverWalletData = {
    account?: Account;
    balance: string;
    contract?: ContractState | FullContractState;
    transaction?: Transaction;
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


export class EverWalletService {

    /**
     * Current data of the wallet
     * @type {EverWalletData}
     * @protected
     */
    protected data: EverWalletData = DEFAULT_WALLET_DATA

    /**
     * Current state of the wallet connection
     * @type {EverWalletState}
     * @protected
     */
    protected state: EverWalletState = DEFAULT_WALLET_STATE

    constructor() {
        this.#contractSubscriber = undefined

        makeAutoObservable(this, {
            connect: action.bound,
            disconnect: action.bound,
        })

        reaction(
            () => this.data.contract?.balance,
            balance => {
                this.data.balance = balance || '0'
            },
        )

        reaction(
            () => this.data.account,
            (account, prevAccount) => {
                if (prevAccount?.address?.toString() === account?.address?.toString()) {
                    this.state.isConnecting = false
                    return
                }

                this.handleAccountChange(account).then(() => {
                    runInAction(() => {
                        this.state.isConnecting = false
                    })
                })
            },
        )

        this.init().catch(reason => {
            error('Wallet init error', reason)
            runInAction(() => {
                this.state.isConnecting = false
            })
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

        const hasProvider = await hasEverscaleProvider()

        runInAction(() => {
            this.state.hasProvider = hasProvider
            this.state.isConnecting = true
        })

        try {
            await connectToWallet()
            runInAction(() => {
                this.state.isConnecting = false
            })
        }
        catch (e) {
            error('Wallet connect error', e)
            runInAction(() => {
                this.state.isConnecting = false
            })
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

        this.state.isConnecting = true

        try {
            await rpc.disconnect()
            this.reset()
        }
        catch (e) {
            error('Wallet disconnect error', e)
            runInAction(() => {
                this.state.isConnecting = false
            })
        }
    }

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

    public get isReady(): boolean {
        return (
            !this.isInitializing
            && !this.isConnecting
            && this.isInitialized
            && this.isConnected
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
        this.state.isInitializing = true

        const hasProvider = await hasEverscaleProvider()

        if (!hasProvider) {
            runInAction(() => {
                this.state.isInitializing = false
                this.state.hasProvider = false
            })
            return
        }

        runInAction(() => {
            this.state.hasProvider = hasProvider
        })

        await rpc.ensureInitialized()

        runInAction(() => {
            this.state.isInitializing = false
            this.state.isInitialized = true
            this.state.isConnecting = true
        })

        const permissionsSubscriber = await rpc.subscribe('permissionsChanged')
        permissionsSubscriber.on('data', event => {
            runInAction(() => {
                this.data.account = event.permissions.accountInteraction
            })
        })

        const currentProviderState = await rpc.getProviderState()

        if (currentProviderState.permissions.accountInteraction === undefined) {
            runInAction(() => {
                this.state.isConnecting = false
            })
            return
        }

        runInAction(() => {
            this.state.isConnecting = true
        })

        await connectToWallet()

        runInAction(() => {
            this.state.isConnecting = false
        })
    }

    /**
     * Reset wallet data to defaults
     * @protected
     */
    protected reset(): void {
        this.data = DEFAULT_WALLET_DATA
        this.state.isConnecting = false
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

        runInAction(() => {
            this.state.isUpdatingContract = true
        })

        try {
            const { state } = await rpc.getFullContractState({
                address: account.address,
            })

            runInAction(() => {
                this.data.contract = state
                this.state.isUpdatingContract = false
            })
        }
        catch (e) {
            error('Get account full contract state error', e)
        }
        finally {
            runInAction(() => {
                this.state.isUpdatingContract = false
            })
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

                runInAction(() => {
                    this.data.contract = event.state
                })
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
