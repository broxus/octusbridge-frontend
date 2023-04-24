import { BaseSignerWalletAdapter, WalletReadyState } from '@solana/wallet-adapter-base'
import type { Adapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import type { ConnectionConfig } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { action, computed, makeObservable } from 'mobx'

import { BaseStore } from '@/stores/BaseStore'
import type { WalletNativeCoin } from '@/types'
import { debug, error } from '@/utils'
import { networks } from '@/config'


export type SolanaWallet = {
    adapter: Adapter | BaseSignerWalletAdapter;
    readyState: WalletReadyState;
}

export type SolanaWalletData = {
    address?: string;
    balance?: string;
    publicKey: PublicKey | null;
}

export type SolanaWalletState = {
    adapterName: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnecting: boolean;
    isInitialized: boolean;
    isInitializing: boolean;
}

export type SolanaWalletServiceCtorOptions = {
    adapters: Adapter[];
    autoConnect?: boolean;
    connectionConfig?: ConnectionConfig;
    endpoint: string;
}


const DEFAULT_WALLET_DATA: SolanaWalletData = {
    address: undefined,
    balance: '0',
    publicKey: null,
}

const DEFAULT_WALLET_STATE: SolanaWalletState = {
    adapterName: null,
    isConnected: false,
    isConnecting: false,
    isDisconnecting: false,
    isInitialized: false,
    isInitializing: false,
}


export class SolanaWalletService extends BaseStore<SolanaWalletData, SolanaWalletState> {

    constructor(
        protected readonly nativeCoin?: WalletNativeCoin,
        protected readonly options?: SolanaWalletServiceCtorOptions,
    ) {
        super()

        if (options?.endpoint === undefined) {
            throw new Error('Connection endpoint or connection config not defined')
        }

        this.setData(() => DEFAULT_WALLET_DATA)

        this.setState(() => DEFAULT_WALLET_STATE)

        this._connection = new Connection(options.endpoint, options.connectionConfig)

        makeObservable<SolanaWalletService, '_wallets' | 'wallets' | 'wallet'>(this, {
            adapterName: computed,
            connect: action.bound,
            disconnect: action.bound,
            isConnected: computed,
            isConnecting: computed,
            isDisconnecting: computed,
            isInitialized: computed,
            isInitializing: computed,
            publicKey: computed,
            wallet: computed,
            wallets: computed,
            // eslint-disable-next-line sort-keys
            _wallets: computed,
        })

        this._wallets.forEach(wallet => {
            wallet.adapter.on('readyStateChange', (readyState: WalletReadyState) => {
                // eslint-disable-next-line no-param-reassign
                wallet.readyState = readyState
            })
        })

        this.setState('isInitialized', this.wallet.readyState === WalletReadyState.Installed)

        this.wallet.adapter.on('connect', (...args) => {
            debug('Connect to Solana Wallet', ...args)
        })
        this.wallet.adapter.on('disconnect', (...args) => {
            debug('Disconnect from Solana Wallet', ...args)
        })
        this.wallet.adapter.on('error', (...args) => {
            debug(...args)
        })

        if (this.isInitialized && options.autoConnect) {
            this.init().catch(reason => {
                error(reason)
            })
        }
    }

    /**
     * Manually connect to the wallet
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        if (this.isConnecting || this.isDisconnecting || this.wallet.adapter === undefined) {
            return
        }

        if (![WalletReadyState.Loadable, WalletReadyState.Installed].includes(this.wallet.readyState)) {
            this.setState('adapterName', null)

            if (typeof window !== 'undefined') {
                window.open(this.wallet.adapter.url, '_blank')
            }

            return
        }

        this.setState('isConnecting', true)

        try {
            await this.wallet.adapter.connect()

            const { publicKey } = this.wallet.adapter

            this.setData('address', publicKey?.toBase58())
            this.setData('publicKey', publicKey)
            this.setState({
                adapterName: this.wallet.adapter.name,
                isConnected: true,
            })

            if (publicKey != null) {
                try {
                    this.setData(
                        'balance',
                        (await this.connection?.getBalance(publicKey))?.toString(),
                    )
                }
                catch (e) {
                    error('Sync balance on first connect error', e)
                }
            }
        }
        catch (e) {
            error('Connect wallet error', e)
            this.setState('adapterName', null)
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
            await this.wallet.adapter.disconnect()
            this.reset()
        }
        catch (e) {
            error('Disconnect Solana wallet error', e)
        }
        finally {
            this.setState('isDisconnecting', false)
        }
    }

    /**
     * Returns computed wallet address value
     * @returns {string | undefined}
     */
    public get address(): SolanaWalletData['address'] {
        return this.data.address
    }

    /**
     * Returns computed wallet balance value
     * @returns {string | undefined}
     */
    public get balance(): SolanaWalletData['balance'] {
        return this.data.balance
    }

    /**
     *
     */
    public get publicKey(): SolanaWalletData['publicKey'] {
        return this.data.publicKey
    }

    /**
     * Returns `true` if wallet is connected
     * @returns {boolean}
     */
    public get isConnected(): SolanaWalletState['isConnected'] {
        return this.state.isConnected
    }

    /**
     * Returns `true` if wallet is connecting
     * @returns {boolean}
     */
    public get isConnecting(): SolanaWalletState['isConnecting'] {
        return this.state.isConnecting
    }

    /**
     * Returns `true` if wallet is disconnecting
     * @returns {boolean}
     */
    public get isDisconnecting(): SolanaWalletState['isDisconnecting'] {
        return this.state.isDisconnecting
    }

    /**
     * Returns `true` if wallet is initialized
     * @returns {boolean}
     */
    public get isInitialized(): SolanaWalletState['isInitialized'] {
        return this.state.isInitialized
    }

    /**
     * Returns `true` if wallet is initializing
     * @returns {boolean}
     */
    public get isInitializing(): SolanaWalletState['isInitializing'] {
        return this.state.isInitializing
    }

    /**
     * Returns current Adapter name
     */
    public get adapterName(): SolanaWalletState['adapterName'] {
        return this.state.adapterName
    }

    /**
     * Returns computed BigNumber instance of the wallet balance value
     * @returns {BigNumber}
     */
    public get balanceNumber(): BigNumber {
        return new BigNumber(this.balance || 0).shiftedBy(-this.coin.decimals)
    }

    /**
     * Returns wallet native currency
     * @returns {WalletNativeCoin}
     */
    public get coin(): WalletNativeCoin {
        return {
            balance: this.balance,
            decimals: this.nativeCoin?.decimals ?? 9,
            icon: this.wallet.adapter.icon,
            name: this.nativeCoin?.symbol,
            symbol: this.nativeCoin?.symbol ?? 'SOL',
        }
    }

    /**
     * Returns `true` if connection is available.
     * That means extension is installed and activated, else `false`
     * @returns {boolean}
     */
    public get hasProvider(): boolean {
        return this.connection != null
    }

    /**
     * Returns `true` if wallet is initialized and connected
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
     *
     */
    public get adapter(): SolanaWallet['adapter'] {
        return this.wallet.adapter
    }

    /**
     *
     */
    public get connection(): Connection | undefined {
        return this._connection
    }

    /**
     * First suggestion of the installed adn detected wallet
     * @protected
     */
    public get wallet(): SolanaWallet {
        return this.wallets[0].length > 0
            ? this.wallets[0][0]
            : this.wallets[0].find(wallet => wallet.adapter.name === 'Phantom')
            || this.wallets[0].find(wallet => wallet.readyState === WalletReadyState.Loadable)
            || this.wallets[1][0]
    }

    /**
     * Separated list of an installed and others wallets adapters
     */
    public get wallets(): [installed: SolanaWallet[], other: SolanaWallet[]] {
        const installed: SolanaWallet[] = []
        const notDetected: SolanaWallet[] = []
        const loadable: SolanaWallet[] = []

        // eslint-disable-next-line no-restricted-syntax
        for (const wallet of this._wallets) {
            if (wallet.readyState === WalletReadyState.NotDetected) {
                notDetected.push(wallet)
            }
            else if (wallet.readyState === WalletReadyState.Loadable) {
                loadable.push(wallet)
            }
            else if (wallet.readyState === WalletReadyState.Installed) {
                installed.push(wallet)
            }
        }

        return [installed, [...loadable, ...notDetected]]
    }

    /**
     * Trying to resolve EVM Wallet connection
     * @protected
     */
    protected async init(): Promise<void> {
        try {
            await this.connect()
        }
        catch (e) {
            error(e)
            this.setState('adapterName', null)
        }
        finally {
            this.setState({
                isInitialized: true,
                isInitializing: false,
            })
        }
    }

    /**
     * Reset wallet data to defaults
     * @protected
     */
    protected reset(): void {
        this.setData(() => DEFAULT_WALLET_DATA)
        this.setState({
            adapterName: null,
            isConnected: false,
        })
    }

    /**
     *
     * @protected
     */
    protected get _wallets(): SolanaWallet[] {
        return this.options?.adapters.map(adapter => ({ adapter, readyState: adapter.readyState })) ?? []
    }

    /**
     *
     * @protected
     */
    protected _connection: Connection | undefined

}

let service: SolanaWalletService

export function useSolanaWallet(): SolanaWalletService {
    if (service === undefined) {
        debug(
            '%cCreated a new one %cSolana Wallet Service%c instance as a global service to interact with the Solana-compatible wallet (e.g. Phantom)',
            'color: #c5e4f3',
            'color: #bae701',
            'color: #c5e4f3',
        )
        const network = networks.find(item => item.chainId === '1' && item.type === 'solana')
        service = new SolanaWalletService({
            decimals: 9,
            name: 'SOL',
            symbol: 'SOL',
        }, {
            adapters: [
                new PhantomWalletAdapter(),
            ],
            // autoConnect: true,
            connectionConfig: { commitment: 'confirmed' },
            endpoint: network?.rpcUrl || clusterApiUrl('mainnet-beta'),
        })
    }
    return service
}
