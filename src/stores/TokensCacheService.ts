import { Mutex } from '@broxus/await-semaphore'
import {
    makeAutoObservable, reaction, runInAction,
} from 'mobx'
import { Address, Subscription } from 'ton-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'

import { BridgeConstants, EthAbi, TokenWallet } from '@/misc'
import { TokensListService } from '@/stores/TokensListService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { error } from '@/utils'


export type BridgeTokenAssetsManifest = {
    name: string;
    token: { [tokenRoot: string]: TokenAsset; };
}

export type TokenAsset = {
    proxy: string;
    vaults: TokenAssetVault[];
}

export type TokenAssetVault = {
    address?: string;
    balance?: string;
    chainId: string;
    decimals?: number;
    depositType: string;
    ethereumConfiguration: string;
    vault: string;
    wrapperAddress?: string;
}

export type TokenCache = {
    balance?: string;
    decimals: number;
    icon?: string;
    isUpdating: boolean;
    isUpdatingWalletAddress: boolean;
    name: string;
    proxy: string;
    root: string;
    symbol: string;
    updatedAt: number;
    vaults: TokenAssetVault[];
    wallet?: string;
}

type TokensCacheStoreData = {
    assets: { [tokenRoot: string]: TokenAsset; };
    tokens: TokenCache[];
}

type TokensCacheStoreState = {
    isFetchingAssets: boolean;
}


export class TokensCacheService {

    /**
     * Current data of the tokens cache
     * @type {TokensCacheStoreData}
     * @protected
     */
    protected data: TokensCacheStoreData = {
        assets: {},
        tokens: [],
    }

    /**
     *
     * @protected
     */
    protected state: TokensCacheStoreState = {
        isFetchingAssets: false,
    }

    constructor(
        protected readonly tonWallet: TonWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensList: TokensListService,
        protected readonly tokensAssetsURI: string,
    ) {
        makeAutoObservable(this)

        // When the Tokens List Service has loaded the list of
        // available tokens, we will start creating a token map
        reaction(
            () => [tokensList.time, tonWallet.address, evmWallet.address, tokensAssetsURI],
            async (
                [time, tonAddress, evmAddress, assetsUri],
                [prevTime, prevTonAddress, prevEvmAddress, prevAssetsUri],
            ) => {
                if (
                    time !== prevTime
                    || tonAddress !== prevTonAddress
                    || evmAddress !== prevEvmAddress
                ) {
                    await this.build()
                }

                if (assetsUri !== prevAssetsUri) {
                    await this.fetchAssets(tokensAssetsURI)
                }
            },
            { delay: 100 },
        )

        this.#tokensBalancesSubscribers = new Map<string, Subscription<'contractStateChanged'>>()
        this.#tokensBalancesSubscribersMutex = new Mutex()

        this.fetchAssets(tokensAssetsURI).catch(reason => {
            error(reason)
        })
    }

    /**
     * Create a tokens list based on the loaded list of
     * tokens in the related `TokensListCache` service.
     * @protected
     */
    protected async build(): Promise<void> {
        if (this.tokensList.tokens.length === 0) {
            return
        }

        this.data.tokens = this.tokensList.tokens.map(token => {
            const asset = this.assets[token.address]
            return {
                decimals: token.decimals,
                icon: token.logoURI,
                isUpdating: false,
                isUpdatingWalletAddress: false,
                name: token.name,
                proxy: asset?.proxy,
                root: token.address,
                symbol: token.symbol,
                updatedAt: -1,
                vaults: asset?.vaults || [],
            }
        })
    }

    /**
     * Returns tokens map where key is a token root address.
     * @protected
     */
    protected get _byRoot(): Record<string, TokensCacheStoreData['tokens'][number]> {
        const entries: Record<string, TokensCacheStoreData['tokens'][number]> = {}
        this.tokens.forEach(token => {
            entries[token.root] = token
        })
        return entries
    }

    /**
     * Returns Bridge token assets.
     * @returns {TokensCacheStoreData['assets']}
     */
    public get assets(): TokensCacheStoreData['assets'] {
        return this.data.assets
    }

    /**
     * Returns list of the cached tokens list.
     * @returns {TokensCacheStoreData['tokens']}
     */
    public get tokens(): TokensCacheStoreData['tokens'] {
        return this.data.tokens
    }

    /**
     * Returns token by the given token root address.
     * @param {string} root
     * @returns {TokensCacheStoreData['tokens'][number] | undefined}
     */
    public get(root: string): TokensCacheStoreData['tokens'][number] | undefined {
        return this._byRoot[root]
    }

    /**
     * Check if token was stored to the cache.
     * @param {string} root
     * @returns {boolean}
     */
    public has(root: string): boolean {
        return this.get(root) !== undefined
    }

    /**
     * Add a new token to the tokens list.
     * @param {TokensCacheStoreData['tokens'][number]} token
     */
    public add(token: TokensCacheStoreData['tokens'][number]): void {
        const tokens = this.tokens.slice()
        tokens.push(token)
        this.data.tokens = tokens
    }

    /**
     * Update token field by the given root address, key and value.
     * @template T
     * @param {string} root
     * @param {K extends keyof TokensCacheData['tokens'][number]} key
     * @param {TokensCacheStoreData['tokens'][number][K]} value
     */
    public update<K extends keyof TokensCacheStoreData['tokens'][number]>(
        root: string,
        key: K,
        value: TokensCacheStoreData['tokens'][number][K],
    ): void {
        const token = this.get(root)
        if (token !== undefined) {
            token[key] = value
        }
    }

    /**
     * Search token by the given query string.
     * Query string can be a token symbol, name or address.
     * @param {string} query
     * @returns {TokensCacheStoreData['tokens'][number][]}
     */
    public async search(query: string): Promise<TokensCacheStoreData['tokens'][number][]> {
        return this.tokens.filter(token => (
            token.symbol?.toLowerCase?.().indexOf(query?.toLowerCase?.()) > -1
            || token.name?.toLowerCase?.().indexOf(query?.toLowerCase?.()) > -1
            || token.root?.toLowerCase?.().indexOf(query?.toLowerCase?.()) > -1
        ))
    }

    /**
     * Returns filtered tokens by the given `chainId`
     * @param {string} chainId
     */
    public filterTokensByChainId(chainId: string): TokensCacheStoreData['tokens'] {
        return this.data.tokens.filter(({ vaults }) => vaults.some(vault => vault.chainId === chainId) || false)
    }

    /**
     * Find token by the given vault address and chain id
     * @param {string} address
     * @param {string} chainId
     */
    public findByVaultAddress(address: string, chainId: string): TokensCacheStoreData['tokens'][number] | undefined {
        return this.filterTokensByChainId(chainId).find(
            ({ vaults }) => vaults.some(
                ({ vault }) => vault.toLowerCase() === address.toLowerCase(),
            ),
        )
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public getEthTokenContract(root: string, chainId: string): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const vault = this.getTokenVault(root, chainId)

        if (vault?.address === undefined) {
            return undefined
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, vault.address)
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public getEthTokenVaultContract(root: string, chainId: string): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const vault = this.getTokenVault(root, chainId)

        if (vault === undefined) {
            return undefined
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.Vault, vault.vault)
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public getEthTokenVaultWrapperContract(root: string, chainId: string): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const vault = this.getTokenVault(root, chainId)

        if (vault?.wrapperAddress === undefined) {
            return undefined
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.VaultWrapper, vault.wrapperAddress)
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     */
    public getTokenVault(root: string, chainId: string): TokenAssetVault | undefined {
        return this.get(root)?.vaults.find(vault => vault.chainId === chainId)
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public async syncEvmToken(root: string, chainId: string): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const vaultContract = this.getEthTokenVaultContract(root, chainId)

        let address: string

        try {
            address = await vaultContract?.methods.token().call()

            this.update(root, 'vaults', token.vaults.map(
                vault => (vault.chainId === chainId ? { ...vault, address } : vault),
            ))
        }
        catch (e) {
            error(e)
            return
        }

        const tokenContract = this.getEthTokenContract(root, chainId)

        try {
            await this.syncEvmTokenVaultBalance(root, chainId)

            const decimals = await tokenContract?.methods.decimals().call()

            this.update(root, 'vaults', token.vaults.map(
                vault => (vault.chainId === chainId
                    ? { ...vault, decimals: parseInt(decimals, 10) }
                    : vault),
            ))

            await this.syncEvmTokenVaultWrapper(root, chainId)
        }
        catch (e) {
            error(e)
        }
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public async syncEvmTokenVaultWrapper(root: string, chainId: string): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenVaultContract = this.getEthTokenVaultContract(root, chainId)

        try {
            const wrapperAddress = await tokenVaultContract?.methods.wrapper().call()

            this.update(root, 'vaults', token.vaults.map(
                vault => (vault.chainId === chainId ? { ...vault, wrapperAddress } : vault),
            ))
        }
        catch (e) {
            error(e)
        }
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public async syncEvmTokenVaultBalance(root: string, chainId: string): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenContract = this.getEthTokenContract(root, chainId)

        try {
            const balance = await tokenContract?.methods.balanceOf(this.evmWallet.address).call()

            this.update(root, 'vaults', token.vaults.map(
                vault => (vault.chainId === chainId ? { ...vault, balance } : vault),
            ))
        }
        catch (e) {
            error(e)
        }
    }

    /**
     * Sync TON token balance with balance in network by the given token root address.
     * Pass `true` in second parameter to force update.
     * @param {string} root
     */
    public async syncTonToken(root: string): Promise<void> {
        if (this.tonWallet.address === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        this.update(root, 'isUpdating', true)

        if (token.wallet === undefined && !token.isUpdatingWalletAddress) {
            try {
                await this.syncTonTokenWalletAddress(root)
            }
            catch (e) {
                error('Sync token wallet address error', e)
                this.update(root, 'wallet', undefined)
            }
        }

        if (token.wallet !== undefined) {
            try {
                await this.syncTonTokenBalance(root)
            }
            catch (e) {
                error('Sync token balance error', e)
                this.update(root, 'balance', undefined)
            }
        }

        this.update(root, 'updatedAt', Date.now())
        this.update(root, 'isUpdating', false)
    }

    /**
     * Sync TON token balance by the given token root address.
     * It updates balance in the tokens list.
     * @param {string} root
     */
    public async syncTonTokenBalance(root: string): Promise<void> {
        if (root === undefined || this.tonWallet.account?.address === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined || token.wallet === undefined) {
            return
        }

        try {
            const balance = await TokenWallet.balance({
                wallet: new Address(token.wallet),
            })
            this.update(root, 'balance', balance)
        }
        catch (e) {
            error('Token balance update error', e)
            this.update(root, 'balance', undefined)
        }
    }

    /**
     * Sync TON token wallet address by the given token root address, and current wallet address.
     * @param {string} root
     */
    public async syncTonTokenWalletAddress(root: string): Promise<void> {
        if (root === undefined || this.tonWallet.account?.address === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        if (token.wallet === undefined) {
            this.update(root, 'isUpdatingWalletAddress', true)

            try {
                const address = await TokenWallet.walletAddress({
                    owner: this.tonWallet.account.address,
                    root: new Address(token.root),
                })
                this.update(root, 'wallet', address.toString())
            }
            catch (e) {
                error('Token wallet address update error', e)
            }
            finally {
                this.update(root, 'isUpdatingWalletAddress', false)
            }
        }
    }

    /**
     * Fetch Bridge assets
     * @param uri
     */
    public async fetchAssets(uri: string): Promise<void> {
        if (this.state.isFetchingAssets) {
            return
        }

        this.state.isFetchingAssets = true

        fetch(uri, { method: 'GET' }).then(
            value => value.json(),
        ).then((value: BridgeTokenAssetsManifest) => {
            runInAction(() => {
                this.data.assets = value.token
                this.state.isFetchingAssets = false
            })
        }).catch(reason => {
            error('Cann`t load bridge token assets list', reason)
            runInAction(() => {
                this.state.isFetchingAssets = false
            })
        })
    }

    /**
     * TON Subscription for the contract state changes.
     * @type {Map<string, Subscription<'contractStateChanged'>>}
     * @private
     */
    #tokensBalancesSubscribers: Map<string, Subscription<'contractStateChanged'>>

    /**
     * Subscribers map mutex. Used to prevent duplicate subscriptions
     * @type Mutex
     * @private
     */
    #tokensBalancesSubscribersMutex: Mutex

}


const TokensCacheServiceStore = new TokensCacheService(
    useTonWallet(),
    useEvmWallet(),
    new TokensListService(BridgeConstants.TokenListURI),
    BridgeConstants.TokenAssetsURI,
)

export function useTokensCache(): TokensCacheService {
    return TokensCacheServiceStore
}
