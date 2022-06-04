import WalletConnectProvider from '@walletconnect/web3-provider'
import { action, computed, makeObservable } from 'mobx'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import type { ICoreOptions } from 'web3modal'
import BigNumber from 'bignumber.js'

import { BaseStore } from '@/stores/BaseStore'
import {
    debug,
    error,
    findNetwork,
    log,
    throwException,
} from '@/utils'
import type { NetworkShape, WalletNativeCoin } from '@/types'
import { networks } from '@/config'


type Asset = {
    address: string; // The address of the token contract
    decimals: number; // The number of token decimals
    image?: string; // A string url of the token logo
    symbol: string; // A ticker symbol or shorthand, up to 5 characters
}

export type EvmWalletData = {
    address?: string;
    balance?: string;
    chainId: string;
    networks: NetworkShape[];
}

export type EvmWalletState = {
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnecting: boolean;
    isInitialized: boolean;
    isInitializing: boolean;
}

export type EvmWalletServiceCtorOptions = {
    modalOptions?: Partial<ICoreOptions>;
    networks?: NetworkShape[];
}


const DEFAULT_WALLET_DATA: EvmWalletData = {
    address: undefined,
    balance: '0',
    chainId: '1',
    networks: [],
}

const DEFAULT_WALLET_STATE: EvmWalletState = {
    isConnected: false,
    isConnecting: false,
    isDisconnecting: false,
    isInitialized: false,
    isInitializing: false,
}


export class EvmWalletService extends BaseStore<EvmWalletData, EvmWalletState> {

    constructor(
        protected readonly nativeCoin?: WalletNativeCoin,
        protected readonly options?: EvmWalletServiceCtorOptions,
    ) {
        super()

        this.setData(() => ({
            ...DEFAULT_WALLET_DATA,
            networks: options?.networks || [],
        }))

        this.setState(() => ({
            ...DEFAULT_WALLET_STATE,
            isInitializing: true,
        }))

        makeObservable<EvmWalletService>(this, {
            address: computed,
            balance: computed,
            chainId: computed,
            coin: computed,
            connect: action.bound,
            disconnect: action.bound,
            hasProvider: computed,
            isConnected: computed,
            isConnecting: computed,
            isDisconnecting: computed,
            isInitialized: computed,
            isInitializing: computed,
            isMetaMask: computed,
            isReady: computed,
            network: computed,
            web3: computed,
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
        if (this.isConnecting || this.isDisconnecting) {
            return
        }

        this.setState('isConnecting', true)

        try {
            this.provider = await this.modal.connect?.()

            this.setData('address', this.provider?.selectedAddress)
            this.setState({
                isConnected: this.provider?.selectedAddress != null,
                isInitialized: this.provider != null,
                isInitializing: false,
            })
        }
        catch (e) {
            error('EVM Wallet connect error', e)
            this.setState({
                isConnected: false,
                isConnecting: false,
                isInitialized: this.provider != null,
                isInitializing: false,
            })
        }

        try {
            await Promise.all([
                this.syncAccountData(),
                this.syncChainId(),
            ])
            await this.syncBalance()
        }
        catch (e) {
            //
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
            await this.provider?.disconnect?.()

            this.modal.clearCachedProvider()

            this.setState('isConnected', false)
            this.setData({
                address: undefined,
                balance: undefined,
                // chainId: '1',
            })

            this.provider = null
        }
        catch (e) {
            error('EVM Wallet disconnect error', e)
        }
        finally {
            this.setState('isDisconnecting', false)
        }
    }

    /**
     * Request to add the given asset to the Wallet assets list
     * @param {Asset} asset
     */
    public async addAsset(asset: Asset): Promise<void> {
        if (!this.hasProvider) {
            return
        }

        try {
            await this.provider.request({
                method: 'wallet_watchAsset',
                params: {
                    options: {
                        address: asset.address,
                        decimals: asset.decimals,
                        image: asset.image,
                        symbol: asset.symbol,
                    },
                    type: 'ERC20',
                },
            })
        }
        catch (e) {
            error('Add asset error', e)
        }
    }

    /**
     * Request to add current network to the Wallet
     * @param {string} chainId
     */
    public async addNetwork(chainId: string): Promise<void> {
        if (!this.hasProvider) {
            return
        }

        try {
            const network = findNetwork(chainId, 'evm')
            if (network === undefined) {
                throwException(`Cannot find EVM network with chainId ${chainId}.`)
            }

            await this.provider.request({
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
            debug('Add network error', e)
        }
    }

    /**
     * Request to change network by the given chain id.
     * @param {string} chainId
     */
    public async changeNetwork(chainId: string): Promise<void> {
        if (!this.hasProvider) {
            return
        }

        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }],
            })

            await this.syncChainId()
            await this.syncBalance()
        }
        catch (e: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (e.code === 4902 || (this.isWalletConnect && /wallet_addethereumchain/gi.test(e.message?.toLowerCase()))) {
                await this.addNetwork(chainId)
            }
            debug('Switch network error', e)
        }
    }

    /**
     * Sync account data
     */
    public async syncAccountData(): Promise<void> {
        if (this.web3 === undefined) {
            return
        }

        this.setState('isConnecting', this.isConnecting === undefined)

        try {
            const [address] = await this.web3.eth.getAccounts()
            this.setData('address', address)
            this.setState({
                isConnected: address != null,
                isConnecting: false,
                isInitialized: true,
                isInitializing: false,
            })
            log(`Sync EVM address: ${address}`)
        }
        catch (e) {
            error('Sync EVM account data error', e)
            this.setData('address', undefined)
            this.setState({
                isConnected: false,
                isConnecting: false,
            })
        }
    }

    /**
     * Sync account balance
     */
    public async syncBalance(): Promise<void> {
        if (this.web3 === undefined) {
            return
        }

        try {
            if (this.address !== undefined) {
                const balance = await this.web3.eth.getBalance(this.address)
                this.setData('balance', balance)
                log(`Sync EVM balance: ${balance}`)
            }
        }
        catch (e) {
            error('Sync EVM balance error', e)
            this.setData('balance', '0')
        }
    }

    /**
     * Sync chain id
     */
    public async syncChainId(): Promise<void> {
        if (this.web3 === undefined) {
            return
        }

        try {
            const chainId = (await this.web3.eth.getChainId()).toString()

            if (chainId !== this.chainId) {
                this.setData('chainId', chainId)
                log(`Sync EVM Chain ID: ${chainId}`)
            }
        }
        catch (e) {
            error('Sync Chain id error', e)
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
     * Returns computed BigNumber instance of the wallet balance value
     * @returns {BigNumber}
     */
    public get balanceNumber(): BigNumber {
        return new BigNumber(this.balance || 0).shiftedBy(-this.coin.decimals)
    }

    /**
     * Returns current network chain id
     * @returns {string}
     */
    public get chainId(): EvmWalletData['chainId'] {
        return this.data.chainId
    }

    /**
     * Returns base native wallet coin
     * @returns {WalletNativeCoin}
     */
    public get coin(): WalletNativeCoin {
        return {
            balance: this.balance,
            decimals: this.nativeCoin?.decimals ?? 18,
            name: this.network?.currencySymbol ?? this.nativeCoin?.symbol,
            symbol: this.network?.currencySymbol ?? this.nativeCoin?.symbol ?? 'eth',
        }
    }

    /**
     * Returns current network shape
     */
    public get network(): EvmWalletData['networks'][number] | undefined {
        return findNetwork(this.chainId, 'evm')
    }

    /**
     * Returns list of networks
     */
    public get networks(): EvmWalletData['networks'] {
        return this.data.networks
    }

    /**
     * Returns current Web3 Instance
     */
    public get web3(): Web3 | undefined {
        return this.provider != null ? new Web3(this.provider) : undefined
    }

    /**
     * Returns `true` if provider is available.
     * That means extension is installed and activated, else `false`
     * @returns {boolean}
     */
    public get hasProvider(): boolean {
        return this.provider != null
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
     * Returns `true` if wallet is disconnecting
     * @returns {boolean}
     */
    public get isDisconnecting(): EvmWalletState['isDisconnecting'] {
        return this.state.isDisconnecting
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

    /**
     * Returns `true` if wallet is Metamask
     */
    public get isMetaMask(): boolean {
        return this.provider.isMetaMask
    }

    /**
     * Returns `true` if wallet connected via WalletConnect
     */
    public get isWalletConnect(): boolean {
        return this.provider instanceof WalletConnectProvider
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
     * Trying to resolve EVM Wallet connection
     * @protected
     */
    protected async init(): Promise<void> {
        this.setState({
            isConnecting: true,
            isInitializing: true,
        })

        try {
            this.provider = this.modal.cachedProvider.length > 0
                ? await this.modal.connectTo(this.modal.cachedProvider)
                : Web3.givenProvider
        }
        catch (e) {
            this.provider = Web3.givenProvider
        }

        try {
            this.setState({
                isInitialized: this.provider != null,
                isInitializing: false,
            })

            if (this.modal.cachedProvider.length > 0) {
                await Promise.all([
                    this.syncAccountData(),
                    this.syncChainId(),
                ])
                await this.syncBalance()
            }
            else {
                this.setState('isConnecting', false)
            }
        }
        catch (e) {
            error('Fetch account data error', e)
            this.setState({
                isConnected: false,
                isConnecting: false,
                isInitialized: this.provider != null,
                isInitializing: false,
            })
        }

        this.provider?.on('accountsChanged', async ([address]: string[]) => {
            if (address !== undefined) {
                await this.syncAccountData()
            }
            else {
                await this.disconnect()
            }
        })

        this.provider?.on('chainChanged', async (chainId: string) => {
            this.setData({
                balance: '0',
                chainId: parseInt(chainId, 16).toString(),
            })
            await Promise.all([
                this.syncAccountData(),
                this.syncBalance(),
            ])
        })

        if (this.modal.cachedProvider.length > 0) {
            setInterval(async () => {
                await this.syncChainId()
                await this.syncBalance()
            }, 15000)
        }
    }

    /**
     *
     * @protected
     */
    protected get modal(): Web3Modal {
        return new Web3Modal({
            cacheProvider: true, // optional
            disableInjectedProvider: false,
            ...this.options?.modalOptions,
        })
    }

    protected provider: any | null

}


let wallet: EvmWalletService

export function useEvmWallet(): EvmWalletService {
    if (wallet === undefined) {
        log(
            '%cCreated a new one EvmWalletService instance as global service to interact with the EVM Wallet browser extension',
            'color: #bae701',
        )
        wallet = new EvmWalletService({
            decimals: 18,
            symbol: 'ETH',
        }, {
            modalOptions: {
                providerOptions: {
                    walletconnect: {
                        options: {
                            rpc: networks
                                .filter(network => network.type === 'evm')
                                .reduce<Record<number, string>>((acc, value) => {
                                    acc[Number(value.chainId)] = value.rpcUrl
                                    return acc
                                }, {}),
                        },
                        package: WalletConnectProvider, // required
                    },
                },
                theme: 'dark',
            },
        })
    }
    return wallet
}
