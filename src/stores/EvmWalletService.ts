import WalletConnectProvider from '@walletconnect/web3-provider'
import { action, makeAutoObservable, runInAction } from 'mobx'
import Web3 from 'web3'
import Web3Modal from 'web3modal'

import {
    error,
    findNetwork,
    log,
    throwException,
} from '@/utils'

type Asset = {
    address: string; // The address of the token contract
    decimals: number; // The number of token decimals
    image: string; // A string url of the token logo
    symbol: string; // A ticker symbol or shorthand, up to 5 characters
}


export type EvmWalletData = {
    address?: string;
    balance?: string;
    chainId: string;
}

export type EvmWalletState = {
    isConnected: boolean;
    isConnecting: boolean | undefined;
    isInitialized: boolean;
    isInitializing: boolean;
}

const DEFAULT_WALLET_DATA: EvmWalletData = {
    address: undefined,
    balance: '0',
    chainId: '1',
}

const DEFAULT_WALLET_STATE: EvmWalletState = {
    isConnected: false,
    isConnecting: undefined,
    isInitialized: false,
    isInitializing: false,
}


export class EvmWalletService {

    /**
     * Current data of the wallet
     * @type {EvmWalletData}
     * @protected
     */
    protected data: EvmWalletData = DEFAULT_WALLET_DATA

    /**
     * Current state of the wallet connection
     * @type {EvmWalletState}
     * @protected
     */
    protected state: EvmWalletState = DEFAULT_WALLET_STATE

    constructor() {
        makeAutoObservable(this, {
            connect: action.bound,
            disconnect: action.bound,
        })

        this.init().catch(reason => {
            error(reason)
        })
    }

    /**
     * Manually connect to the wallet
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        try {
            this.state.isConnecting = true
            this.#provider = await this.#web3modal?.connect?.()
            this.#web3 = new Web3(this.#provider)

            runInAction(() => {
                this.data.address = this.#provider.selectedAddress
                this.state.isConnected = this.#provider.selectedAddress != null
                this.state.isInitialized = this.cachedProvider === 'injected'
                this.state.isInitializing = false
            })
        }
        catch (e) {
            error(e)
            runInAction(() => {
                this.state.isConnected = false
                this.state.isConnecting = false
                this.state.isInitialized = false
                this.state.isInitializing = false
            })
        }

        await this.syncChainId()

        await this.syncAccountData()
    }

    /**
     * Manually disconnect from the wallet
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        try {
            await this.clearCachedProvider()
            await this.#provider?.close?.()
            await this.#provider?.disconnect?.()

            runInAction(() => {
                this.state.isConnected = false
                this.data.address = undefined
            })

            this.#web3 = undefined
            this.#provider = undefined
        }
        catch (e) {
            error(e)
        }
    }

    /**
     * Returns computed wallet address value
     * @returns {string | undefined}
     */
    public get address(): EvmWalletData['address'] {
        return this.data.address
    }

    /**
     * Returns computed wallet balance value
     * @returns {string | undefined}
     */
    public get balance(): EvmWalletData['balance'] {
        return this.data.balance
    }

    /**
     * Returns `true` if provider is available.
     * That means extension is installed and activated, else `false`
     * @returns {boolean}
     */
    public get hasProvider(): boolean {
        return this.cachedProvider !== undefined
    }

    /**
     * Returns `true` if wallet is connected
     * @returns {boolean}
     */
    public get isConnected(): EvmWalletState['isConnected'] {
        return this.state.isConnected
    }

    /**
     * Returns `true` if wallet is connecting
     * @returns {boolean}
     */
    public get isConnecting(): EvmWalletState['isConnecting'] {
        return this.state.isConnecting
    }

    /**
     * Returns `true` if wallet is initialized
     * @returns {boolean}
     */
    public get isInitialized(): EvmWalletState['isInitialized'] {
        return this.state.isInitialized
    }

    /**
     * Returns `true` if wallet is initializing
     * @returns {boolean}
     */
    public get isInitializing(): EvmWalletState['isInitializing'] {
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

    public get chainId(): string {
        return this.data.chainId
    }

    public get isMetaMask(): boolean {
        return this.#provider.isMetaMask
    }

    public get web3(): Web3 | undefined {
        return this.#web3
    }

    public async changeNetwork(chainId: string): Promise<void> {
        if (this.#provider === undefined) {
            return
        }

        try {
            await this.#provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }],
            })
            await this.syncBalance()
            await this.syncChainId()
        }
        catch (e: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (e.code === 4902) {
                await this.addNetwork(chainId)
            }
            error('Switch network error', e)
        }
    }

    public async addNetwork(chainId: string): Promise<void> {
        try {
            const network = findNetwork(chainId, 'evm')
            if (network === undefined) {
                throwException(`Cannot find EVM network with chainId ${chainId}.`)
            }

            await this.#provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    blockExplorerUrls: [network.explorerBaseUrl],
                    chainId: `0x${parseInt(chainId, 10).toString(16)}`,
                    chainName: network.name,
                    nativeCurrency: {
                        decimals: 18,
                        name: network.currencySymbol,
                        symbol: network.currencySymbol,
                    },
                    rpcUrls: [network.rpcUrl],
                }],
            })
        }
        catch (e) {
            error('Add network error', e)
        }
    }

    public async addAsset(asset: Asset): Promise<void> {
        try {
            await this.#provider.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: asset.address,
                        decimals: asset.decimals,
                        image: asset.image,
                        symbol: asset.symbol,
                    },
                },
            })
        }
        catch (e) {
            error('Add asset error', e)
        }
    }

    public async syncAccountData(): Promise<void> {
        if (this.#web3 === undefined) {
            return
        }

        this.state.isConnecting = this.state.isConnecting === undefined

        try {
            const [address] = await this.#web3.eth.getAccounts()
            runInAction(() => {
                this.data.address = address
                this.state.isConnecting = false
                this.state.isConnected = address !== undefined
                this.state.isInitialized = true
                this.state.isInitializing = false
            })
            log(`Sync EVM address: ${address}`)
        }
        catch (e) {
            error('Sync EVM account data error', e)
            runInAction(() => {
                this.data.address = undefined
                this.state.isConnecting = false
                this.state.isConnected = false
            })
        }
    }

    public async syncBalance(): Promise<void> {
        if (this.#web3 === undefined) {
            return
        }

        try {
            if (this.address !== undefined) {
                const balance = await this.#web3.eth.getBalance(this.address)
                runInAction(() => {
                    this.data.balance = balance
                })
                log(`Sync EVM balance: ${balance}`)
            }
        }
        catch (e) {
            error('Sync EVM balance error', e)
            runInAction(() => {
                this.data.balance = '0'
            })
        }
    }

    public async syncChainId(): Promise<void> {
        if (this.#web3 === undefined) {
            return
        }

        try {
            const chainId = await this.#web3.eth.getChainId()

            if (chainId.toString() !== this.chainId) {
                runInAction(() => {
                    this.data.chainId = chainId.toString()
                })
                log(`Sync EVM Chain ID: ${chainId.toString()}`)
            }
        }
        catch (e) {
            error('Sync Chain ID error', e)
        }
    }

    protected async init(): Promise<void> {
        this.state.isConnecting = true
        this.state.isInitializing = true

        this.#provider = Web3.givenProvider
        this.#web3 = new Web3(this.#provider)

        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider, // required
                options: {
                    infuraId: 'a3213a051cf14524857e0794e6da9064', // required
                },
            },
        }

        this.#web3modal = new Web3Modal({
            network: 'mainnet', // optional
            cacheProvider: true, // optional
            disableInjectedProvider: false,
            providerOptions, // required
        })

        try {
            await this.syncChainId()

            runInAction(() => {
                this.state.isInitialized = this.cachedProvider === 'injected'
                this.state.isInitializing = false
            })

            await this.syncAccountData()
            await this.syncBalance()
        }
        catch (e) {
            error('Fetch account data error', e)
            runInAction(() => {
                this.state.isConnected = false
                this.state.isConnecting = false
                this.state.isInitialized = false
                this.state.isInitializing = false
            })
        }

        this.#provider.on('accountsChanged', async () => {
            await this.syncAccountData()
        })

        this.#provider.on('chainChanged', async (chainId: string) => {
            runInAction(() => {
                this.data.chainId = parseInt(chainId, 16).toString()
            })
            await this.syncAccountData()
        })

        setInterval(async () => {
            await this.syncChainId()
            await this.syncBalance()
        }, 20000)
    }

    protected get cachedProvider(): string | undefined {
        return this.#web3modal?.cachedProvider
    }

    protected clearCachedProvider(): void {
        this.#web3modal?.clearCachedProvider()
    }

    #provider: any

    #web3: Web3 | undefined

    #web3modal: Web3Modal | undefined

}


const Service = new EvmWalletService()

export function useEvmWallet(): EvmWalletService {
    return Service
}
