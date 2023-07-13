/* eslint-disable @typescript-eslint/no-use-before-define */
import { action, computed, makeObservable } from 'mobx'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

import { BaseStore } from '@/stores/BaseStore'
import { debug, error, findNetwork, log, throwException } from '@/utils'
import { type NetworkShape, type WalletNativeCoin } from '@/types'
import { EvmProvider, EvmWalletType } from '@/models/EvmProvider'

type Asset = {
    address: string // The address of the token contract
    decimals: number // The number of token decimals
    image?: string // A string url of the token logo
    symbol: string // A ticker symbol or shorthand, up to 5 characters
}

export type EvmWalletData = {
    address?: string
    balance?: string
    chainId: string
    networks: NetworkShape[]
}

export type EvmWalletState = {
    isConnected: boolean
    isConnecting: boolean
    isDisconnecting: boolean
    isInitialized: boolean
    isInitializing: boolean
    walletTypePopupVisible: boolean
}

export type EvmWalletServiceCtorOptions = {
    networks?: NetworkShape[]
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
    walletTypePopupVisible: false,
}

export class EvmWalletService extends BaseStore<EvmWalletData, EvmWalletState> {

    protected evmProvider: EvmProvider

    constructor(
        protected readonly nativeCoin?: WalletNativeCoin,
        protected readonly options?: EvmWalletServiceCtorOptions,
    ) {
        super()

        this.setData(() => ({
            ...DEFAULT_WALLET_DATA,
            networks: options?.networks || [],
        }))

        this.setState(() => DEFAULT_WALLET_STATE)

        makeObservable<EvmWalletService>(this, {
            address: computed,
            balance: computed,
            chainId: computed,
            coin: computed,
            connectTo: action.bound,
            disconnect: action.bound,
            isConnected: computed,
            isConnecting: computed,
            isDisconnecting: computed,
            isInitialized: computed,
            isInitializing: computed,
            isMetaMask: computed,
            isReady: computed,
            network: computed,
            web3: computed,
            connect: action.bound,
            walletTypePopupVisible: computed,
            hideWalletTypePopup: action.bound,
        })

        this.onAccountsChanged = this.onAccountsChanged.bind(this)
        this.onChainChanged = this.onChainChanged.bind(this)
        this.onDisconnect = this.onDisconnect.bind(this)

        this.evmProvider = new EvmProvider(
            this.onAccountsChanged,
            this.onChainChanged,
            this.onDisconnect,
        )

        this.init().catch(error)
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
            await this.evmProvider.init()
        }
        catch (e) {
            error(e)
        }

        try {
            this.setState({
                isInitialized: !!this.evmProvider.provider,
                isInitializing: false,
            })

            await Promise.all([this.syncAccountData(), this.syncChainId()])
            await this.syncBalance()
            this.setState('isConnecting', false)
        }
        catch (e) {
            error('Fetch account data error', e)
            this.setState({
                isConnected: false,
                isConnecting: false,
                isInitialized: false,
                isInitializing: false,
            })
        }
    }

    protected async onAccountsChanged([address]: string[]): Promise<void> {
        try {
            if (address !== undefined) {
                await this.syncAccountData()
            }
            else {
                await this.disconnect()
            }
        }
        catch (e) {
            error(e)
        }
    }

    protected async onChainChanged(chainId: string): Promise<void> {
        try {
            this.setData({
                balance: '0',
                chainId: parseInt(chainId, 16).toString(),
            })
            await Promise.all([this.syncAccountData(), this.syncBalance()])
        }
        catch (e) {
            error(e)
        }
    }

    protected async onDisconnect(): Promise<void> {
        this.setState('isConnected', false)
        this.setData({
            address: undefined,
            balance: undefined,
        })
    }

    public connect(): void {
        if (this.isConnecting || this.isDisconnecting) {
            return
        }

        this.setState({
            walletTypePopupVisible: true,
        })
    }

    public hideWalletTypePopup(): void {
        this.setState({
            walletTypePopupVisible: false,
        })
    }

    /**
     * Manually connect to the wallet
     * @returns {Promise<void>}
     */
    public async connectTo(walletType: EvmWalletType): Promise<void> {
        if (this.isConnecting || this.isDisconnecting) {
            return
        }

        this.setState('isConnecting', true)

        try {
            await this.evmProvider.connect(walletType)

            this.setState({
                isConnected: true,
                isInitialized: true,
                isInitializing: false,
            })
        }
        catch (e) {
            error('EVM Wallet connect error', e)
            this.setState({
                isConnected: false,
                isConnecting: false,
                isInitialized: false,
                isInitializing: false,
            })
        }

        try {
            await Promise.all([this.syncAccountData(), this.syncChainId()])
            await this.syncBalance()
        }
        catch (e) {
            error('EVM Wallet connect error', e)
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
            await this.evmProvider.disconnect()

            this.setState('isConnected', false)
            this.setData({
                address: undefined,
                balance: undefined,
            })
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
        if (!this.evmProvider.provider) {
            return
        }

        try {
            await this.evmProvider.provider.request({
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
        if (!this.evmProvider.provider) {
            return
        }

        try {
            const network = findNetwork(chainId, 'evm')
            if (network === undefined) {
                throwException(`Cannot find EVM network with chainId ${chainId}.`)
            }

            await this.evmProvider.provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        blockExplorerUrls: [network.explorerBaseUrl],
                        chainId: `0x${parseInt(chainId, 10).toString(16)}`,
                        chainName: network.name,
                        nativeCurrency: {
                            decimals: 18,
                            name: network.currencySymbol,
                            symbol: network.currencySymbol,
                        },
                        rpcUrls: [network.rpcUrl],
                    },
                ],
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
        if (!this.evmProvider.provider) {
            return
        }

        try {
            this.evmProvider.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }],
            })

            await this.syncChainId()
            await this.syncBalance()
        }
        catch (e: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (
                e.code === 4902
                || (this.isWalletConnect && /wallet_addethereumchain/gi.test(e.message?.toLowerCase()))
            ) {
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
        return this.evmProvider.provider != null ? new Web3(this.evmProvider.provider) : undefined
    }

    /**
     * Returns `true` if provider is available.
     * That means extension is installed and activated, else `false`
     * @returns {boolean}
     */
    public hasProvider = true

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
        return this.evmProvider.walletType === EvmWalletType.MetaMask
    }

    /**
     * Returns `true` if wallet connected via WalletConnect
     */
    public get isWalletConnect(): boolean {
        return this.evmProvider.walletType === EvmWalletType.WalletConnect
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

    public get walletTypePopupVisible(): boolean {
        return this.state.walletTypePopupVisible
    }

}

let wallet: EvmWalletService

export function useEvmWallet(): EvmWalletService {
    if (wallet === undefined) {
        debug(
            '%cCreated a new one %cEvm Wallet Service%c instance as a global service to interact with the EVM-compatible wallet browser extension (e.g. Metamask)',
            'color: #c5e4f3',
            'color: #bae701',
            'color: #c5e4f3',
        )

        wallet = new EvmWalletService({
            decimals: 18,
            symbol: 'ETH',
        })
    }

    return wallet
}
