import { Mutex } from '@broxus/await-semaphore'
import {
    action,
    computed,
    makeObservable,
    observable,
    reaction, runInAction,
} from 'mobx'
import { Address, Contract, Subscription } from 'everscale-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'
import Web3 from 'web3'

import rpc from '@/hooks/useRpcClient'
import {
    BridgeConstants,
    EthAbi,
    TokenAbi,
    TokenWallet,
} from '@/misc'
import { BaseStore } from '@/stores/BaseStore'
import { TokensListService } from '@/stores/TokensListService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { error, findNetwork, getEverscaleMainNetwork } from '@/utils'
import { NetworkType } from '@/types'

import { EverWalletService, useEverWallet } from './EverWalletService'

export type BridgeTokenAssetsManifest = {
    name: string;
    token: TokenAssets;
}

export type TokenAssets = {
    [tokenRoot: string]: TokenPipelines;
}

export type TokenAssetVault = {
    balance?: string;
    chainId: string;
    decimals?: number;
    depositType: string;
    ethereumConfiguration: string;
    limit?: string;
    tokenAddress?: string;
    tokenBalance?: string;
    vault: string;
}

export type TokenPipelines = {
    [pipeline: string]: {
        proxy: string;
        vaults: TokenAssetVault[];
    }
}

export type TokenCache = {
    balance?: string;
    decimals: number;
    icon?: string;
    name: string;
    pipelines: TokenPipelines;
    root: string;
    symbol: string;
    updatedAt: number;
    wallet?: string;
}

export type Pipeline = {
    depositType: string;
    chainId?: string;
    ethereumConfiguration: string;
    everscaleConfiguration?: Address;
    everscaleTokenRoot: string;
    evmTokenAddress?: string;
    evmTokenBalance?: string;
    evmTokenDecimals?: number;
    from: string;
    proxy: string;
    to: string;
    tokenBase: string;
    vault: string;
    vaultBalance?: string;
    vaultLimit?: string;
}

type TokensCacheStoreData = {
    assets: TokenAssets;
    pipelines: Pipeline[];
    tokens: TokenCache[];
}

type TokensCacheStoreState = {
    isFetchingAssets: boolean;
    updatingTokens: Map<string, boolean>;
    updatingTokensBalance: Map<string, boolean>;
    updatingTokensWallet: Map<string, boolean>;
}


export class TokensCacheService extends BaseStore<TokensCacheStoreData, TokensCacheStoreState> {

    /**
     * Current data of the tokens cache
     * @type {TokensCacheStoreData}
     * @protected
     */
    protected data: TokensCacheStoreData = {
        assets: {},
        pipelines: [],
        tokens: [],
    }

    /**
     * Current state if the tokens cache
     * @protected
     */
    protected state: TokensCacheStoreState = {
        isFetchingAssets: false,
        updatingTokens: new Map<string, boolean>(),
        updatingTokensBalance: new Map<string, boolean>(),
        updatingTokensWallet: new Map<string, boolean>(),
    }

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensList: TokensListService,
        protected readonly tokensAssetsURI: string,
    ) {
        super()

        makeObservable<TokensCacheService, '_byRoot' | 'data' | 'state'>(this, {
            _byRoot: computed,
            data: observable,
            state: observable,
            add: action.bound,
            tokens: computed,
            pipelines: computed,
        })

        // When the Tokens List Service has loaded the list of
        // available tokens, we will start creating a token map
        reaction(
            () => [
                tokensList.time,
                tokensList.tokens,
                everWallet.address,
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
     *
     * Reduce all possible pipelines for all tokens vaults
     * @protected
     */
    protected async build(): Promise<void> {
        if (this.tokensList.tokens.length === 0) {
            return
        }

        this.setData(
            'tokens',
            this.tokensList.tokens
                .filter(token => token.vendor === 'broxus' && token.verified)
                .map(token => {
                    const assetPipelines = this.assets[token.address]
                    const cachedToken = this.get(token.address)
                    const pipelines = { ...(cachedToken?.pipelines || assetPipelines || {}) }
                    Object.values(pipelines).forEach(pipeline => {
                    // eslint-disable-next-line no-param-reassign
                        pipeline.vaults = pipeline.vaults?.map(
                            vault => ({ balance: undefined, ...vault }),
                        ) || []
                    })
                    return {
                        decimals: token.decimals,
                        icon: token.logoURI,
                        isUpdating: false,
                        isUpdatingWalletAddress: false,
                        name: token.name,
                        pipelines,
                        root: token.address,
                        symbol: token.symbol,
                        updatedAt: -1,
                    }
                }),
        )

        const everscaleMainNetwork = getEverscaleMainNetwork()
        const everscaleMainNetworkId = `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`

        this.setData(
            'pipelines',
            Object.entries(this.assets).reduce(
                (acc: Pipeline[], [tokenRoot, pipelines]) => {
                    Object.entries(pipelines).forEach(([key, pipeline]) => {
                        const [tokenBase, to] = key.split('_') as NetworkType[]
                        pipeline.vaults.forEach(vault => {
                            const pl = {
                                chainId: vault.chainId,
                                depositType: vault.depositType,
                                ethereumConfiguration: vault.ethereumConfiguration,
                                everscaleTokenRoot: tokenRoot,
                                evmTokenAddress: vault.tokenAddress,
                                evmTokenDecimals: vault.decimals,
                                proxy: pipeline.proxy,
                                tokenBase,
                                vault: vault.vault,
                                vaultBalance: vault.balance,
                                vaultLimit: vault.limit,
                            }
                            acc.push(
                                {
                                    ...pl,
                                    from: tokenBase === 'everscale' ? everscaleMainNetworkId : `${tokenBase}-${vault.chainId}`,
                                    to: to === 'everscale' ? everscaleMainNetworkId : `${to}-${vault.chainId}`,
                                },
                                {
                                    ...pl,
                                    from: to === 'everscale' ? everscaleMainNetworkId : `${to}-${vault.chainId}`,
                                    to: tokenBase === 'everscale' ? everscaleMainNetworkId : `${tokenBase}-${vault.chainId}`,
                                },
                            )
                        })
                    })
                    return acc
                },
                [],
            ),
        )
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
     * Returns List of all possible pipelines
     * @returns {Pipeline[]}
     */
    public get pipelines(): TokensCacheStoreData['pipelines'] {
        return this.data.pipelines
    }

    /**
     * Returns `true` if tokens list was loaded and tokens build.
     */
    public get isInitialized(): boolean {
        return this.tokens.length > 0
    }

    /**
     *
     * @param root
     */
    public isTokenUpdating(root: string): boolean {
        return this.state.updatingTokens.get(root) || false
    }

    /**
     *
     * @param root
     */
    public isTokenUpdatingBalance(root: string): boolean {
        return this.state.updatingTokensBalance.get(root) || false
    }

    /**
     *
     * @param root
     */
    public isTokenUpdatingWallet(root: string): boolean {
        return this.state.updatingTokensWallet.get(root) || false
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
     * Returns token pipeline by the given token `root` address, `from` and `to` network (`<networkType>-<chainId>`) keys,
     * and optionally `depositType` (Default: default)
     * @param {string} root
     * @param {string} from
     * @param {string} to
     * @param {string} [depositType]
     */
    public pipeline(
        root: string,
        from: string,
        to: string,
        depositType: string = 'default',
    ): Pipeline | undefined {
        return this.pipelines.find(pipeline => (
            pipeline.everscaleTokenRoot === root
            && pipeline.from === from
            && pipeline.to === to
            && pipeline.depositType === depositType
        ))
    }

    /**
     * Search token by the given query string.
     * Query string can be a token symbol, name or address.
     * @param {string} query
     * @returns {TokensCacheStoreData['tokens'][number][]}
     */
    public async search(query: string): Promise<TokensCacheStoreData['tokens'][number][]> {
        return this.tokens.filter(token => (
            token.symbol?.toLowerCase?.().includes(query?.toLowerCase?.())
            || token.name?.toLowerCase?.().includes(query?.toLowerCase?.())
            || token.root?.toLowerCase?.().includes(query?.toLowerCase?.())
        ))
    }

    /**
     * Returns filtered tokens by the given `chainId` and optional `pipeline` key
     * @param {string} chainId
     * @param {string} [pipeline]
     */
    public filterTokensByChainId(chainId: string, pipeline?: string): TokensCacheStoreData['tokens'] {
        return this.tokens.filter(
            token => {
                if (pipeline === undefined) {
                    return Object.values(token.pipelines).some(
                        pl => (
                            pl.vaults.some(vault => vault.chainId === chainId)
                        ),
                    )
                }

                return token.pipelines[pipeline]?.vaults.some(
                    vault => vault.chainId === chainId,
                )
            },
        )
    }

    /**
     * Returns token by the given vault `address`, `chainId` and optional `pipeline` key
     * @param {string} address
     * @param {string} chainId
     * @param {string} [pipeline]
     */
    public findTokenByVaultAddress(
        address: string,
        chainId: string,
        pipeline?: string,
    ): TokensCacheStoreData['tokens'][number] | undefined {
        return this.tokens.find(
            token => {
                if (pipeline === undefined) {
                    return Object.values(token.pipelines).some(
                        pl => (
                            pl.vaults.some(vault => (
                                vault.vault.toLowerCase() === address.toLowerCase()
                                && vault.chainId === chainId
                            ))
                        ),
                    )
                }

                return token.pipelines[pipeline]?.vaults.some(
                    vault => (
                        vault.vault.toLowerCase() === address.toLowerCase()
                        && vault.chainId === chainId
                    ),
                )
            },
        )
    }

    /**
     * If EVM Wallet is connected, web3 service is defined, token vault exist, vault has token
     * address (sync, if it has not) - returns `ERC20 Contract`, otherwise `undefined`
     * @param {Pipeline} [pipeline]
     */
    public async getEvmTokenContract(pipeline?: Pipeline): Promise<EthContract | undefined> {
        if (this.evmWallet.web3 === undefined || pipeline?.chainId === undefined) {
            return undefined
        }

        if (pipeline?.evmTokenAddress === undefined) {
            await this.syncEvmTokenAddress(pipeline)
        }

        if (pipeline?.evmTokenAddress === undefined) {
            return undefined
        }

        const network = findNetwork(pipeline.chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== pipeline.chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.ERC20, pipeline.evmTokenAddress)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, pipeline.evmTokenAddress)
    }

    /**
     * Returns Eth token vault Contract by the given token `root` address, `chainId` and `depositType`
     * @param {Pipeline} [pipeline]
     */
    public getEvmTokenVaultContract(pipeline?: Pipeline): EthContract | undefined {
        if (this.evmWallet.web3 === undefined || pipeline?.chainId === undefined) {
            return undefined
        }

        const network = findNetwork(pipeline.chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== pipeline.chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.Vault, pipeline.vault)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.Vault, pipeline.vault)
    }

    /**
     * Returns Everscale token wallet Contract by the given token `root`
     * @param {string} root
     */
    public async getEverscaleTokenWalletContract(root: string): Promise<Contract<typeof TokenAbi.Wallet> | undefined> {
        let wallet = this.get(root)?.wallet

        if (wallet === undefined) {
            await this.syncEverscaleTokenWalletAddress(root)
        }

        wallet = this.get(root)?.wallet

        if (wallet === undefined) {
            return undefined
        }

        return new rpc.Contract(TokenAbi.Wallet, new Address(wallet))
    }

    /**
     * Sync EVM token data
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmToken(pipeline?: Pipeline): Promise<void> {
        if (pipeline === undefined) {
            return
        }

        try {
            await this.syncEvmTokenAddress(pipeline)
        }
        catch (e) {
            error('Sync EVM token address error', e)
            return
        }

        try {
            await Promise.all([
                this.syncEvmTokenDecimals(pipeline),
                this.syncEvmTokenBalance(pipeline),
                this.syncEvmTokenVaultBalance(pipeline),
            ])
        }
        catch (e) {
            error('Sync EVM token decimals, balance, vault balance or vault wrapper error', e)
        }

        try {
            await this.syncEvmTokenVaultLimit(pipeline)
        }
        catch (e) {
            // error('Sync EVM token vault limit error', e)
        }

    }

    /**
     * Sync EVM token address
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenAddress(pipeline?: Pipeline): Promise<void> {
        if (pipeline === undefined) {
            return
        }

        if (pipeline?.evmTokenAddress !== undefined) {
            return
        }

        const evmTokenAddress = await this.getEvmTokenVaultContract(pipeline)?.methods.token().call()

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenAddress = evmTokenAddress
        })

        this.setData('pipelines', this.pipelines.map(
            pl => ((
                pl.chainId === pipeline.chainId
                && pl.everscaleTokenRoot === pipeline.everscaleTokenRoot
                && pl.vault === pipeline.vault
            ) ? { ...pl, evmTokenAddress } : pl),
        ))
    }

    /**
     * Sync EVM token decimals
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenDecimals(pipeline?: Pipeline): Promise<void> {
        if (pipeline === undefined || pipeline?.evmTokenDecimals !== undefined) {
            return
        }

        const tokenContract = await this.getEvmTokenContract(pipeline)

        const evmTokenDecimals = await tokenContract?.methods.decimals().call()

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenDecimals = parseInt(evmTokenDecimals, 10)
        })

        this.setData('pipelines', this.pipelines.map(
            pl => ((
                pl.chainId === pipeline.chainId
                && pl.everscaleTokenRoot === pipeline.everscaleTokenRoot
                && pl.vault === pipeline.vault
            ) ? { ...pl, evmTokenDecimals: parseInt(evmTokenDecimals, 10) } : pl),
        ))
    }

    /**
     * Sync EVM token balance
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenBalance(pipeline?: Pipeline): Promise<void> {
        if (pipeline === undefined) {
            return
        }

        const tokenContract = await this.getEvmTokenContract(pipeline)

        const evmTokenBalance = await tokenContract?.methods.balanceOf(this.evmWallet.address).call()

        if (evmTokenBalance === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenBalance = evmTokenBalance
        })

        this.setData('pipelines', this.pipelines.map(
            pl => ((
                pl.chainId === pipeline.chainId
                && pl.everscaleTokenRoot === pipeline.everscaleTokenRoot
                && pl.vault === pipeline.vault
            ) ? { ...pl, evmTokenBalance } : pl),
        ))
    }

    /**
     * Sync EVM token vault balance by the given token `root` address and `chainId`.
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenVaultBalance(pipeline?: Pipeline): Promise<void> {
        if (pipeline === undefined) {
            return
        }

        const tokenContract = await this.getEvmTokenContract(pipeline)

        const vaultBalance = await tokenContract?.methods.balanceOf(pipeline.vault).call()

        if (vaultBalance === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.vaultBalance = vaultBalance
        })

        this.setData('pipelines', this.pipelines.map(
            pl => ((
                pl.chainId === pipeline.chainId
                && pl.everscaleTokenRoot === pipeline.everscaleTokenRoot
                && pl.vault === pipeline.vault
            ) ? { ...pl, vaultBalance } : pl),
        ))
    }

    /**
     * Sync EVM token vault balance limit by the given token root address and chainId.
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenVaultLimit(pipeline?: Pipeline): Promise<void> {
        if (pipeline === undefined) {
            return
        }

        const tokenVaultContract = this.getEvmTokenVaultContract(pipeline)

        const vaultLimit = await tokenVaultContract?.methods.availableDepositLimit().call()

        if (vaultLimit === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.vaultLimit = vaultLimit
        })

        this.setData('pipelines', this.pipelines.map(
            pl => ((
                pl.chainId === pipeline.chainId
                && pl.everscaleTokenRoot === pipeline.everscaleTokenRoot
                && pl.vault === pipeline.vault
            ) ? { ...pl, vaultLimit } : pl),
        ))
    }

    /**
     * Sync TON token balance with balance in network by the given token root address.
     * Pass `true` in second parameter to force update.
     * @param {string} root
     */
    public async syncEverscaleToken(root: string): Promise<void> {
        if (this.everWallet.address === undefined) {
            return
        }

        let token: TokenCache | undefined

        token = this.get(root)

        if (token === undefined || this.isTokenUpdating(root)) {
            return
        }

        this.state.updatingTokens.set(root, true)

        if (token.wallet === undefined && !this.isTokenUpdatingWallet(root)) {
            try {
                await this.syncEverscaleTokenWalletAddress(root)
            }
            catch (e) {
                error('Sync token wallet address error', e)
                token.wallet = undefined
            }
        }

        token = this.get(root)

        if (token && token.wallet !== undefined && !this.isTokenUpdatingBalance(root)) {
            try {
                await this.syncEverscaleTokenBalance(root)
            }
            catch (e) {
                error('Sync token balance error', e)
                token.balance = undefined
            }
        }

        if (token !== undefined) {
            token.updatedAt = Date.now()
            this.state.updatingTokens.set(root, false)
        }
    }

    /**
     * Sync TON token balance by the given token root address.
     * It updates balance in the tokens list.
     * @param {string} root
     */
    public async syncEverscaleTokenBalance(root: string): Promise<void> {
        if (root === undefined || this.everWallet.account?.address === undefined || this.isTokenUpdatingBalance(root)) {
            return
        }

        const token = this.get(root)

        if (token === undefined || token.wallet === undefined) {
            return
        }

        try {
            this.state.updatingTokensBalance.set(root, true)
            token.balance = await TokenWallet.balance({
                wallet: new Address(token.wallet),
            })
        }
        catch (e) {
            // error('Token balance update error', e)
            token.balance = undefined
        }
        finally {
            this.state.updatingTokensBalance.set(root, false)
        }
    }

    /**
     * Sync TON token wallet address by the given token root address, and current wallet address.
     * @param {string} root
     */
    public async syncEverscaleTokenWalletAddress(root: string): Promise<void> {
        if (root === undefined || this.everWallet.account?.address === undefined || this.isTokenUpdatingWallet(root)) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        if (token.wallet === undefined) {
            this.state.updatingTokensWallet.set(root, true)

            try {
                token.wallet = (await TokenWallet.walletAddress({
                    owner: this.everWallet.account.address,
                    root: new Address(token.root),
                })).toString()
            }
            catch (e) {
                error('Token wallet address update error', e)
            }
            finally {
                this.state.updatingTokensWallet.set(root, false)
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

        this.setState('isFetchingAssets', true)

        fetch(uri, { method: 'GET' }).then(
            value => value.json(),
        ).then((value: BridgeTokenAssetsManifest) => {
            this.setData('assets', value.token)
            this.setState('isFetchingAssets', false)
        }).catch(reason => {
            error('Cannot load bridge token assets list', reason)
            this.setState('isFetchingAssets', false)
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
    useEverWallet(),
    useEvmWallet(),
    new TokensListService(BridgeConstants.TokenListURI),
    BridgeConstants.TokenAssetsURI,
)

export function useTokensCache(): TokensCacheService {
    return TokensCacheServiceStore
}
