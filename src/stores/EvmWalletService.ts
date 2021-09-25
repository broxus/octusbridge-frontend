import WalletConnectProvider from '@walletconnect/web3-provider'
import { action, makeAutoObservable, runInAction } from 'mobx'
import Web3 from 'web3'
import Web3Modal from 'web3modal'

import { UserData } from '@/models/UserData'
import { error } from '@/utils'


export type WalletData = {
    address?: string;
    balance?: string;
    chainId: number;
}

export type WalletState = {
    isConnected: boolean;
    isConnecting: boolean;
    isInitialized: boolean;
    isInitializing: boolean;
}

const DEFAULT_WALLET_DATA: WalletData = {
    address: undefined,
    balance: '0',
    chainId: 1,
}

const DEFAULT_WALLET_STATE: WalletState = {
    isConnected: false,
    isConnecting: false,
    isInitialized: false,
    isInitializing: false,
}


export class EvmWalletService {

    /**
     * Current data of the wallet
     * @type {WalletData}
     * @protected
     */
    protected data: WalletData = DEFAULT_WALLET_DATA

    /**
     * Current state of the wallet connection
     * @type {WalletState}
     * @protected
     */
    protected state: WalletState = DEFAULT_WALLET_STATE

    constructor() {
        makeAutoObservable(this, {
            connect: action.bound,
            disconnect: action.bound,
        })

        this.init().catch(reason => {
            error(reason)
        })
    }

    protected async init(): Promise<void> {
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
            this.state.isConnected = this.#provider.selectedAddress != null
        }
        catch (e) {}

        if (!this.isConnected) {
            return
        }

        try {
            await this.fetchAccountData()
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

        try {
            const chainId = await this.#web3.eth.getChainId()
            runInAction(() => {
                this.data.chainId = chainId
            })
        }
        catch (e) {
            error('Chain ID request error', e)
        }

        this.#provider.on('accountsChanged', () => {
            this.fetchAccountData()
        })

        this.#provider.on('chainChanged', (chainId: string) => {
            runInAction(() => {
                this.data.chainId = parseInt(chainId, 16)
            })
            this.fetchAccountData()
        })

        this.#provider.on('networkChanged', () => {
            this.fetchAccountData()
        })

    }

    public async connect(): Promise<UserData | undefined> {
        try {
            this.state.isInitializing = true
            this.#provider = await this.#web3modal?.connect?.()
            this.#web3 = new Web3(this.#provider)
            runInAction(() => {
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

        // eslint-disable-next-line no-return-await
        return await this.fetchAccountData()
    }

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

    public async changeNetwork(chainId: string): Promise<void> {
        if (this.#provider === undefined) {
            return
        }

        try {
            await this.#provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }],
            })
        }
        catch (switchError) {
            // TODO add network configurations
            // This error code indicates that the chain has not been added to MetaMask.
            // @ts-ignore
            if (switchError.code === 4902) {
                // try {
                //     await this.#provider.request({
                //         method: 'wallet_addEthereumChain',
                //         params: [{ chainId: '0xf00', rpcUrl: 'https://...' /* ... */ }],
                //     })
                // }
                // catch (addError) {
                //     // handle "add" error
                // }
            }
            // handle other "switch" errors
        }
    }

    public get account(): UserData | undefined {
        return new UserData(this.data.address, this.data.balance, this.#provider, this.#web3)
    }

    public get address(): WalletData['address'] {
        return this.account?.address
    }

    public get chainId(): number {
        return this.data.chainId
    }

    public get web3(): Web3 | undefined {
        return this.#web3
    }

    public get isConnected(): WalletState['isConnected'] {
        return this.state.isConnected
    }

    public get isConnecting(): WalletState['isConnecting'] {
        return this.state.isConnecting
    }

    public get isInitialized(): WalletState['isInitialized'] {
        return this.state.isInitialized
    }

    public get isInitializing(): WalletState['isInitializing'] {
        return this.state.isInitializing
    }

    protected get cachedProvider(): string | undefined {
        return this.#web3modal?.cachedProvider
    }

    protected clearCachedProvider(): void {
        this.#web3modal?.clearCachedProvider()
    }

    protected async fetchAccountData(): Promise<UserData | undefined> {
        if (this.#web3 !== undefined) {
            this.state.isConnecting = true

            try {
                const [account] = await this.#web3.eth.getAccounts()
                runInAction(() => {
                    this.data.address = account
                    this.state.isConnecting = false
                    this.state.isConnected = account !== undefined
                })
            }
            catch (e) {
                error(e)
                runInAction(() => {
                    this.data.address = undefined
                    this.state.isConnecting = false
                    this.state.isConnected = false
                })
            }

            try {
                if (this.data.address !== undefined) {
                    const balance = await this.#web3?.eth.getBalance(this.data.address)
                    runInAction(() => {
                        this.data.balance = balance
                    })
                }
            }
            catch (e) {
                error(e)
                runInAction(() => {
                    this.data.balance = '0'
                })
            }

            return new UserData(this.data.address, this.data.balance, this.#provider, this.#web3)
        }
        return undefined
    }

    #provider: any

    #web3: Web3 | undefined

    #web3modal: Web3Modal | undefined

}


const EvmWalletServiceStore = new EvmWalletService()

export function useEvmWallet(): EvmWalletService {
    return EvmWalletServiceStore
}
