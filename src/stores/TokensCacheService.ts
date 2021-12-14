import { Mutex } from '@broxus/await-semaphore'
import {
    makeAutoObservable, reaction, runInAction,
} from 'mobx'
import { Address, Contract, Subscription } from 'ton-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'
import Web3 from 'web3'

import {
    BridgeConstants, EthAbi, TokenAbi, TokenWallet,
} from '@/misc'
import { TokensListService } from '@/stores/TokensListService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { error, findNetwork, log } from '@/utils'


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
    limit?: string;
    tokenBalance?: string;
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
            () => [
                tokensList.time,
                tokensList.tokens,
                tonWallet.address,
                evmWallet.address,
                this.assets,
            ],
            async (
                [time, tokens, tonAddress, evmAddress, assets],
                [prevTime, prevTokens, prevTonAddress, prevEvmAddress, prevAssets],
            ) => {
                if (
                    time !== prevTime
                    || tokens !== prevTokens
                    || tonAddress !== prevTonAddress
                    || evmAddress !== prevEvmAddress
                    || assets !== prevAssets
                ) {
                    await this.build()
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
            const cachedToken = this.get(token.address)
            const vaults = (cachedToken?.vaults !== undefined && cachedToken.vaults.length > 0)
                ? cachedToken?.vaults
                : asset?.vaults
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
                vaults: vaults?.map(vault => ({ balance: undefined, ...vault })) || [],
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
     * Returns `true` if tokens list was loaded and tokens build.
     */
    public get isInitialized(): boolean {
        return this.tokens.length > 0
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
     * @template T, K
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
        return this.tokens.filter(({ vaults }) => vaults.some(vault => vault.chainId === chainId) || false)
    }

    /**
     * Find token by the given vault address and `chainId`
     * @param {string} address
     * @param {string} chainId
     */
    public findTokenByVaultAddress(address: string, chainId: string): TokensCacheStoreData['tokens'][number] | undefined {
        return this.filterTokensByChainId(chainId).find(
            ({ vaults }) => vaults.some(
                vault => vault.vault.toLowerCase() === address.toLowerCase() && vault.chainId === chainId,
            ),
        )
    }

    /**
     * Returns bridge token vault by the given token `root` address,
     * network `chainId` and `depositType`.
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public getTokenVault(root: string, chainId: string, depositType: string = 'default'): TokenAssetVault | undefined {
        return this.get(root)?.vaults.find(vault => vault.chainId === chainId && vault.depositType === depositType)
    }

    /**
     *
     * @param root
     */
    public getTokenProxyAddress(root: string): Address | undefined {
        const proxy = this.get(root)?.proxy

        if (proxy === undefined) {
            return undefined
        }

        return new Address(proxy)
    }

    /**
     *
     * @param root
     */
    public getTokenProxyContract(root: string): Contract<typeof TokenAbi.TokenTransferProxy> | undefined {
        const proxyAddress = this.getTokenProxyAddress(root)

        if (proxyAddress === undefined) {
            return undefined
        }

        return new Contract(TokenAbi.TokenTransferProxy, proxyAddress)
    }

    /**
     * If EVM Wallet is connected, web3 service is defined, token vault exist, vault has token
     * address (sync, if have not) - returns `ERC20 Contract`, otherwise `undefined`
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async getEthTokenContract(root: string, chainId: string, depositType: string = 'default'): Promise<EthContract | undefined> {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault?.address === undefined) {
            await this.syncEvmTokenAddress(root, chainId, depositType)
        }

        if (tokenVault?.address === undefined) {
            return undefined
        }

        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.ERC20, tokenVault.address)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, tokenVault.address)
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public getEthTokenVaultContract(root: string, chainId: string, depositType: string = 'default'): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault === undefined) {
            return undefined
        }

        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.Vault, tokenVault.vault)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.Vault, tokenVault.vault)
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public getEthTokenVaultWrapperContract(root: string, chainId: string, depositType: string = 'default'): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault?.wrapperAddress === undefined) {
            return undefined
        }

        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.VaultWrapper, tokenVault.wrapperAddress)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.VaultWrapper, tokenVault.wrapperAddress)
    }

    /**
     *
     * @param root
     */
    public async getTonConfigurationContract(
        root: string,
    ): Promise<Contract<typeof TokenAbi.TonEventConfig> | undefined> {
        const proxyContract = this.getTokenProxyContract(root)

        if (proxyContract === undefined) {
            return undefined
        }

        const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()
        const tonConfigurationAddress = proxyDetails.value0.tonConfiguration

        return new Contract(TokenAbi.TonEventConfig, tonConfigurationAddress)
    }

    /**
     *
     * @param root
     */
    public async getTonTokenWalletContract(root: string): Promise<Contract<typeof TokenAbi.Wallet> | undefined> {
        let wallet = this.get(root)?.wallet

        if (wallet === undefined) {
            await this.syncTonTokenWalletAddress(root)
        }

        wallet = this.get(root)?.wallet

        if (wallet === undefined) {
            return undefined
        }

        return new Contract(TokenAbi.Wallet, new Address(wallet))
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmToken(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        try {
            await this.syncEvmTokenAddress(root, chainId, depositType)
        }
        catch (e) {
            error('Sync EVM token address error', e)
            return
        }

        try {
            await Promise.all([
                this.syncEvmTokenDecimals(root, chainId, depositType),
                this.syncEvmTokenBalance(root, chainId, depositType),
                this.syncEvmTokenVaultBalance(root, chainId, depositType),
                this.syncEvmTokenVaultLimit(root, chainId, depositType),
                this.syncEvmTokenVaultWrapper(root, chainId, depositType),
            ])
        }
        catch (e) {
            error('Sync EVM token decimals, balance, vault balance or vault wrapper error', e)
        }
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmTokenAddress(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            throw new Error(`Cannot find token by the given root address ${root} and chainId ${chainId}`)
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault?.address !== undefined) {
            log(`Sync EMV token (${token.symbol}) address. Address already synced. Skip..`)
            return
        }

        const vaultContract = this.getEthTokenVaultContract(root, chainId, depositType)

        const address = await vaultContract?.methods.token().call()

        log(`Sync EMV token (${token.symbol}) address by chainId (${chainId}) and deposit type (${depositType})`)

        this.update(root, 'vaults', token.vaults.map(
            vault => (vault.chainId === chainId ? { ...vault, address } : vault),
        ))
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmTokenDecimals(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            throw new Error(`Cannot find token by the given root address ${root} and chainId ${chainId}`)
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault?.decimals !== undefined) {
            log(`Sync EMV token (${token.symbol}) decimals. Decimals already synced. Skip..`)
            return
        }

        const tokenContract = await this.getEthTokenContract(root, chainId, depositType)

        const decimals = await tokenContract?.methods.decimals().call()

        log(`Sync EMV token (${token.symbol}) decimals by chainId (${chainId}) and deposit type (${depositType})`)

        this.update(root, 'vaults', token.vaults.map(
            vault => (vault.chainId === chainId
                ? { ...vault, decimals: parseInt(decimals, 10) }
                : vault),
        ))
    }

    /**
     *
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmTokenBalance(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            throw new Error(`Cannot find token by the given root address ${root} and chainId ${chainId}`)
        }

        const tokenContract = await this.getEthTokenContract(root, chainId, depositType)

        const balance = await tokenContract?.methods.balanceOf(this.evmWallet.address).call()

        if (balance === undefined) {
            return
        }

        this.update(root, 'vaults', token.vaults.map(
            vault => (vault.chainId === chainId ? { ...vault, tokenBalance: balance } : vault),
        ))
    }

    /**
     * Sync EVM token vault balance by the given token root address and chainId.
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmTokenVaultBalance(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            throw new Error(`Cannot find token by the given root address ${root} and chainId ${chainId}`)
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault === undefined) {
            return
        }

        const tokenContract = await this.getEthTokenContract(root, chainId, depositType)

        const balance = await tokenContract?.methods.balanceOf(tokenVault.vault).call()

        if (balance === undefined) {
            return
        }

        this.update(root, 'vaults', token.vaults.map(
            vault => (vault.chainId === chainId ? { ...vault, balance } : vault),
        ))
    }

    /**
     * Sync EVM token vault balance limit by the given token root address and chainId.
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmTokenVaultLimit(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            throw new Error(`Cannot find token by the given root address ${root} and chainId ${chainId}`)
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault === undefined) {
            return
        }

        const tokenVaultContract = await this.getEthTokenVaultContract(root, chainId, depositType)

        const limit = await tokenVaultContract?.methods.availableDepositLimit().call()

        if (limit === undefined) {
            return
        }

        this.update(root, 'vaults', token.vaults.map(
            vault => (vault.chainId === chainId ? { ...vault, limit } : vault),
        ))
    }

    /**
     * Sync EVM token vault wrapper by the given token root address and chainId.
     * @param {string} root
     * @param {string} chainId
     * @param {string} depositType
     */
    public async syncEvmTokenVaultWrapper(root: string, chainId: string, depositType: string = 'default'): Promise<void> {
        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenVault = this.getTokenVault(root, chainId, depositType)

        if (tokenVault?.wrapperAddress !== undefined) {
            log(`Sync EMV token (${token.symbol}) vault wrapper address. Wrapper address already synced. Skip..`)
            return
        }

        const tokenVaultContract = this.getEthTokenVaultContract(root, chainId, depositType)

        const wrapperAddress = await tokenVaultContract?.methods.wrapper().call()

        log(`Sync EMV token (${token.symbol}) vault wrapper address by chainId (${chainId}) and deposit type (${depositType})`)

        this.update(root, 'vaults', token.vaults.map(
            vault => (vault.chainId === chainId ? { ...vault, wrapperAddress } : vault),
        ))
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

        let token: TokenCache | undefined

        token = this.get(root)

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

        token = this.get(root)

        if (token && token.wallet !== undefined) {
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
