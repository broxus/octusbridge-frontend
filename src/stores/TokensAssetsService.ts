import { Address, Contract, ProviderRpcClient } from 'everscale-inpage-provider'
import {
    computed,
    makeObservable,
    reaction,
    runInAction,
} from 'mobx'
import Web3 from 'web3'
import { Contract as EthContract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

import {
    AlienTokenListURI,
    BridgeAssetsURI,
    TokenAssetsURI,
    TokenListURI,
} from '@/config'
import rpc from '@/hooks/useRpcClient'
import staticRpc from '@/hooks/useStaticRpc'
import {
    EthAbi,
    MultiVault,
    TokenAbi,
    TokenWallet,
} from '@/misc'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheState } from '@/stores/TokensCacheService'
import { TokensListService } from '@/stores/TokensListService'
import { NetworkType, Token } from '@/types'
import {
    error,
    findNetwork,
    isEverscaleAddressValid,
    isEvmAddressValid,
    storage,
    warn,
} from '@/utils'
import { BaseStore } from '@/stores/BaseStore'


export type BridgeTokenAssetsManifest = {
    name: string;
    multitoken: TokenRawPipelines;
    token: TokenRawAssets;
}

export type TokenRawAssets = {
    [tokenRoot: string]: TokenRawPipelines;
}

export type TokenRawAssetVault = {
    chainId: string;
    depositType: string;
    ethereumConfiguration: string;
    token?: string;
    vault: string;
}

export type TokenRawPipeline = {
    proxy: string;
    vaults: TokenRawAssetVault[];
}

export type TokenRawPipelines = {
    [pipeline: string]: TokenRawPipeline;
}


export type TokensAssets = {
    [tokenRoot: string]: TokenPipelines;
}

export type TokenPipeline = {
    proxy: string;
    vaults: TokenRawAssetVault[];
}

export type TokenPipelines = {
    [pipeline: string]: TokenPipeline;
}

export type TokenAsset = Token & {
    key: string;
    pipelines: Pipeline[];
}

export type Pipeline = {
    chainId: string;
    depositFee?: string;
    depositType: string;
    ethereumConfiguration: Address;
    everscaleConfiguration?: Address;
    everscaleTokenAddress?: string;
    evmTokenAddress?: string;
    evmTokenBalance?: string;
    evmTokenDecimals?: number;
    from: string;
    isBlacklisted?: boolean;
    isMultiVault: boolean;
    isNative?: boolean;
    mergeEverscaleToken?: string;
    mergeEvmToken?: string;
    mergePool?: string;
    proxy: string;
    to: string;
    tokenBase: string;
    vault: string;
    vaultBalance?: string;
    vaultLimit?: string;
    withdrawFee?: string;
}


type TokensAssetsStoreData = {
    assets: TokensAssets;
    multiAssets: TokenPipelines;
    tokens: TokenAsset[];
}

type TokensAssetsStoreState = TokensCacheState<TokenAsset> & {
    isFetchingAssets: boolean;
}

type TokensAssetsServiceCtorOptions = {
    alienTokensLists?: TokensListService[];
    assetsUri: string;
    primaryTokensList: TokensListService;
}


export async function getCanonicalToken(pipeline: Pipeline): Promise<string | undefined> {
    try {
        if (pipeline.everscaleTokenAddress === undefined) {
            return undefined
        }
        const proxyContract = new staticRpc.Contract(
            MultiVault.AlienProxy,
            new Address(pipeline.proxy),
        )
        const mergeRouterAddress = (await proxyContract.methods.deriveMergeRouter({
            token: new Address(pipeline.everscaleTokenAddress),
            answerId: 0,
        }).call()).router

        const mergeRouterState = (await staticRpc.getFullContractState(
            { address: mergeRouterAddress },
        )).state

        if (mergeRouterState?.isDeployed) {
            const mergeRouterContract = new staticRpc.Contract(
                MultiVault.MergeRouter,
                mergeRouterAddress,
            )
            const mergePoolAddress = (await mergeRouterContract.methods.getPool({
                answerId: 0,
            }).call()).value0

            const mergePoolState = (await staticRpc.getFullContractState({
                address: mergePoolAddress,
            })).state

            if (mergePoolState?.isDeployed) {
                const mergePoolContract = new staticRpc.Contract(
                    MultiVault.MergePool,
                    mergePoolAddress,
                )
                return (await mergePoolContract.methods.getCanon({
                    answerId: 0,
                }).call()).value0.toString()
            }
        }
        return undefined
    }
    catch (e) {
        error('Check merged token error', e)
        return undefined
    }
}

export function alienTokenProxyContract(
    provider: ProviderRpcClient,
    root: string,
): Contract<typeof MultiVault.AlienProxy> {
    return new provider.Contract(MultiVault.AlienProxy, new Address(root))
}

export function nativeTokenProxyContract(
    provider: ProviderRpcClient,
    root: string,
): Contract<typeof MultiVault.NativeProxy> {
    return new provider.Contract(MultiVault.NativeProxy, new Address(root))
}


export class TokensAssetsService extends BaseStore<TokensAssetsStoreData, TokensAssetsStoreState> {

    private tokensList: TokensListService

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly _options: TokensAssetsServiceCtorOptions,
    ) {
        super()

        const {
            assetsUri,
            primaryTokensList,
            alienTokensLists,
        } = _options

        this.tokensList = primaryTokensList

        this.setData({
            assets: {},
            tokens: [],
            multiAssets: {},
        })

        this.setState('isFetchingAssets', false)

        makeObservable<TokensAssetsService, '_byKey'>(this, {
            _byKey: computed,
            isFetchingAssets: computed,
            isReady: computed,
        })

        // When the Tokens List Service has loaded the list of
        // available tokens, we will start creating a token map
        reaction(
            () => [primaryTokensList.tokens, alienTokensLists],
            async ([tokens, aliens], [prevTokens, prevAliens]) => {
                if (tokens !== prevTokens || aliens !== prevAliens) {
                    await this.build()
                }
            },
            { delay: 100 },
        )

        this.fetchAssets(assetsUri).catch(reason => {
            error(reason)
        })
    }

    /**
     * Create a tokens list based on the loaded lists of
     * tokens in the related `TokensList` service.
     *
     * Reduce all possible pipelines for all tokens vaults
     * @protected
     */
    protected async build(): Promise<void> {
        if (this.tokensList.tokens.length === 0) {
            this.setState('isReady', false)
            return
        }

        this.tokensList.tokens.forEach(token => {
            this.add({
                chainId: token.chainId.toString(),
                decimals: token.decimals,
                icon: token.logoURI,
                name: token.name,
                pipelines: [],
                key: `everscale-${token.chainId}-${token.address.toLowerCase()}`,
                root: `${token.address?.toLowerCase()}`,
                symbol: token.symbol,
                updatedAt: -1,
                vendor: token.vendor,
                verified: token.verified,
            })
        })

        const exists = new Set<string>()

        Object.entries(this.assets).forEach(([tokenRoot, pipelines]) => {
            const cachedToken = this.get('everscale', '1', tokenRoot)
            if (cachedToken !== undefined) {
                Object.entries(pipelines).forEach(([_, pipeline]) => {
                    pipeline.vaults.forEach(vault => {
                        const key = `evm-${vault.chainId}-${vault.token?.toLowerCase()}`
                        if (!exists.has(key) && vault.token !== undefined) {
                            this.add({
                                chainId: vault.chainId,
                                decimals: cachedToken.decimals,
                                icon: cachedToken.icon,
                                name: cachedToken.name,
                                pipelines: [],
                                key,
                                root: vault.token?.toLowerCase(),
                                symbol: cachedToken.symbol,
                                updatedAt: -1,
                                vendor: cachedToken.vendor,
                                verified: cachedToken.verified,
                            })

                            exists.add(key)
                        }
                    })
                })
            }
        })

        const alienTokens: TokenAsset[] = this.tokens.slice()

        this._options.alienTokensLists?.forEach(list => {
            list.tokens.forEach(token => {
                const key = `evm-${token.chainId}-${token.address.toLowerCase()}`
                if (!exists.has(key)) {
                    alienTokens.push({
                        chainId: token.chainId.toString(),
                        decimals: token.decimals,
                        icon: token.logoURI,
                        name: token.name,
                        pipelines: [],
                        key,
                        root: token.address?.toLowerCase(),
                        symbol: token.symbol,
                        updatedAt: -1,
                        vendor: token.vendor,
                        verified: token.verified,
                    })
                    exists.add(key)
                }
            })
        })

        this.setData('tokens', alienTokens)

        if (this.tokens.length > 0) {
            setTimeout(() => {
                try {
                    const importedTokens = JSON.parse(storage.get('imported_assets') || '{}')
                    Object.values<TokenAsset>({ ...importedTokens }).forEach(token => {
                        if (!this.has(token.key)) {
                            this.add({ ...token, pipelines: [] })
                        }
                    })
                }
                catch (e) {

                }
            }, 10)
        }
    }

    /**
     * Returns tokens map where key is a token root address.
     * @protected
     */
    protected get _byKey(): Record<string, TokensAssetsStoreData['tokens'][number]> {
        const map: Record<string, TokensAssetsStoreData['tokens'][number]> = {}
        this.tokens.forEach(token => {
            map[token.key] = token
        })
        return map
    }

    /**
     * Returns token by the given `networkType`, `chainId` and token `root` address.
     * @param {string} networkType
     * @param {string} chainId
     * @param {string} root
     * @returns {TokenAsset}
     */
    public get(networkType: string, chainId: string, root: string): TokenAsset | undefined {
        return this._byKey[`${networkType}-${chainId}-${root.toLowerCase()}`]
    }

    /**
     * Check if token was stored to the cache.
     * @param {string} key
     * @returns {boolean}
     */
    public has(key: string): boolean {
        return this._byKey[key] !== undefined
    }

    /**
     * Add a new token to the tokens list.
     * @param {TokenAsset} token
     */
    public add(token: TokenAsset): void {
        if (this.has(token.key)) {
            this.setData('tokens', this.tokens.map(item => {
                if (item.key === token.key.toLowerCase?.()) {
                    return { ...item, ...token }
                }
                return item
            }))
        }
        else {
            const tokens = this.tokens.slice()
            tokens.push({ ...token, root: token.root.toLowerCase() })
            this.setData('tokens', tokens)
        }
    }

    /**
     *
     */
    public get assets(): TokensAssetsStoreData['assets'] {
        return this.data.assets
    }

    /**
     *
     */
    public get multiAssets(): TokensAssetsStoreData['multiAssets'] {
        return this.data.multiAssets
    }

    /**
     * Returns token pipeline by the given token `root` address, `from` and `to` network (`<networkType>-<chainId>`) keys,
     * and optionally `depositType` (Default: default)
     * @param {string} root
     * @param {string} from
     * @param {string} to
     * @param depositType
     */
    public async pipeline(
        root: string,
        from: string,
        to: string,
        depositType: string = 'default',
    ): Promise<Pipeline | undefined> {
        if (!this.isReady) {
            return undefined
        }

        const tokenRoot = root?.toLowerCase()
        const [fromNetworkType, fromChainId] = from.split('-')
        const [toNetworkType, toChainId] = to.split('-')

        const token = this.get(fromNetworkType, fromChainId, tokenRoot)

        if (token === undefined) {
            return undefined
        }

        let pipeline: Pipeline | undefined,
            assetRoot: string | undefined

        if (isEvmAddressValid(tokenRoot)) {
            assetRoot = this.findAssetRootByVaultTokenAndChain(tokenRoot, fromChainId)
        }

        const bridgeAssets = this.assets[assetRoot ?? tokenRoot]

        Object.entries({ ...bridgeAssets }).forEach(([key, { proxy, vaults }]) => {
            const [tokenBase] = key.split('_') as NetworkType[]
            pipeline = vaults.map(vault => {
                const isEverscaleToken = isEverscaleAddressValid(tokenRoot)
                const isEvmToken = isEvmAddressValid(tokenRoot)

                return {
                    chainId: vault.chainId,
                    depositType: vault.depositType,
                    ethereumConfiguration: new Address(vault.ethereumConfiguration),
                    everscaleTokenAddress: isEverscaleToken ? tokenRoot : assetRoot,
                    evmTokenAddress: isEvmToken ? tokenRoot : undefined,
                    evmTokenDecimals: isEvmToken ? token.decimals : undefined,
                    isMultiVault: false,
                    proxy,
                    tokenBase,
                    vault: vault.vault,
                    from,
                    to,
                }
            }).find(asset => {
                if (fromNetworkType === 'evm') {
                    return asset.chainId === fromChainId && asset.depositType === depositType
                }
                if (toNetworkType === 'evm') {
                    return asset.chainId === toChainId && asset.depositType === depositType
                }
                return undefined
            })
        })

        if (pipeline === undefined) {
            if (isEvmAddressValid(tokenRoot)) {
                const asset = this.multiAssets[`${fromNetworkType}_${toNetworkType}`]
                const assetVault = asset.vaults.find(
                    item => item.chainId === fromChainId && item.depositType === depositType,
                )

                if (assetVault !== undefined) {
                    const contract = this.getEvmTokenMultiVaultContract(assetVault.vault, fromChainId)
                    const meta = await contract?.methods.tokens(tokenRoot).call()

                    if (meta.isNative) {
                        const oppositeAsset = this.multiAssets[`${toNetworkType}_${fromNetworkType}`]
                        const vault = oppositeAsset.vaults.find(
                            item => item.chainId === fromChainId
                                && item.depositType === depositType,
                        )

                        if (vault !== undefined) {
                            return {
                                chainId: vault.chainId,
                                depositType: vault.depositType,
                                ethereumConfiguration: new Address(vault.ethereumConfiguration),
                                evmTokenAddress: tokenRoot,
                                isMultiVault: true,
                                proxy: oppositeAsset.proxy,
                                tokenBase: 'everscale',
                                vault: vault.vault,
                                isNative: true,
                                from,
                                to,
                            }
                        }
                    }
                    else {
                        return {
                            chainId: assetVault.chainId,
                            depositType: assetVault.depositType,
                            ethereumConfiguration: new Address(assetVault.ethereumConfiguration),
                            evmTokenAddress: tokenRoot,
                            isMultiVault: true,
                            proxy: asset.proxy,
                            tokenBase: 'evm',
                            vault: assetVault.vault,
                            isNative: false,
                            from,
                            to,
                        }
                    }
                }
            }
            else if (isEverscaleAddressValid(tokenRoot)) {
                let alien = false,
                    canonical,
                    mergeEvmToken,
                    mergeEverscaleToken,
                    mergePool

                try {
                    await staticRpc.ensureInitialized()
                    const rootContract = new staticRpc.Contract(TokenAbi.TokenRootAlienEVM, new Address(tokenRoot))
                    alien = (await rootContract.methods.meta({ answerId: 0 }).call()).base_chainId === toChainId
                }
                catch (e) {
                    error('Check token meta error', e)
                }

                if (!alien) {
                    try {
                        const asset = this.multiAssets[`${toNetworkType}_${fromNetworkType}`]
                        if (asset !== undefined) {
                            const assetVault = asset.vaults.find(
                                item => item.chainId === toChainId && item.depositType === depositType,
                            )
                            if (assetVault !== undefined) {
                                await staticRpc.ensureInitialized()
                                const proxyContract = new staticRpc.Contract(
                                    MultiVault.AlienProxy,
                                    new Address(asset.proxy),
                                )
                                const mergeRouterAddress = (await proxyContract.methods.deriveMergeRouter({
                                    token: new Address(tokenRoot),
                                    answerId: 0,
                                }).call()).router
                                const mergeRouterContract = new staticRpc.Contract(
                                    MultiVault.MergeRouter,
                                    mergeRouterAddress,
                                )
                                const mergePoolAddress = (await mergeRouterContract.methods.getPool({
                                    answerId: 0,
                                }).call()).value0
                                const mergePoolContract = new staticRpc.Contract(MultiVault.MergePool, mergePoolAddress)
                                const mergeTokens = await mergePoolContract.methods.getTokens({
                                    answerId: 0,
                                }).call()

                                canonical = mergeTokens._canon

                                const supportAlien = await Promise.all(mergeTokens._tokens.map(
                                    async ([tokenAddress, tokenSettings]) => {
                                        if (tokenSettings.enabled) {
                                            const tokenContract = new staticRpc.Contract(
                                                TokenAbi.TokenRootAlienEVM,
                                                tokenAddress,
                                            )
                                            const tokenMeta = await tokenContract.methods.meta({ answerId: 0 }).call()
                                            return {
                                                merged: tokenMeta.base_chainId === toChainId,
                                                everscaleToken: tokenAddress.toString(),
                                                evmToken: `0x${new BigNumber(tokenMeta.base_token)
                                                    .toString(16)
                                                    .padStart(40, '0')}`,
                                            }
                                        }
                                        return {
                                            merged: false,
                                            everscaleToken: '',
                                            evmToken: '',
                                        }
                                    },
                                ))

                                const merged = supportAlien.find(e => e.merged)

                                if (merged) {
                                    alien = true
                                    mergeEvmToken = merged.evmToken
                                    mergeEverscaleToken = merged.everscaleToken
                                    mergePool = mergePoolAddress.toString()
                                }
                            }
                        }
                    }
                    catch (e) {
                        error('Check merged token error', e)
                    }
                }

                if (alien) {
                    const asset = this.multiAssets[`${toNetworkType}_${fromNetworkType}`]
                    if (asset !== undefined) {
                        const assetVault = asset.vaults.find(
                            item => item.chainId === toChainId && item.depositType === depositType,
                        )

                        if (assetVault !== undefined) {
                            const p: Pipeline = {
                                chainId: assetVault.chainId,
                                depositType: assetVault.depositType,
                                ethereumConfiguration: new Address(assetVault.ethereumConfiguration),
                                everscaleTokenAddress: tokenRoot,
                                isMultiVault: true,
                                proxy: asset.proxy,
                                tokenBase: 'evm',
                                vault: assetVault.vault,
                                isNative: false,
                                from,
                                to,
                                mergeEvmToken,
                                mergeEverscaleToken,
                                mergePool,
                            }
                            if (canonical === undefined) {
                                const everscaleTokenAddress = await getCanonicalToken(p)
                                if (everscaleTokenAddress !== undefined) {
                                    p.everscaleTokenAddress = everscaleTokenAddress
                                }
                            }
                            else {
                                p.everscaleTokenAddress = canonical.toString()
                            }
                            return p
                        }
                    }
                }
                else {
                    const asset = this.multiAssets[`${fromNetworkType}_${toNetworkType}`]
                    if (asset !== undefined) {
                        const assetVault = asset.vaults.find(
                            item => item.chainId === toChainId && item.depositType === depositType,
                        )
                        if (assetVault !== undefined) {
                            return {
                                chainId: assetVault.chainId,
                                depositType: assetVault.depositType,
                                ethereumConfiguration: new Address(assetVault.ethereumConfiguration),
                                everscaleTokenAddress: tokenRoot,
                                isMultiVault: true,
                                proxy: asset.proxy,
                                tokenBase: 'everscale',
                                vault: assetVault.vault,
                                isNative: true,
                                from,
                                to,
                            }
                        }
                    }
                }
            }
        }

        return pipeline
    }

    /**
     * Returns generated pipeline type
     * @param {string} address
     */
    public getPipelineType(address: string): string | undefined {
        let pipelineType: string | undefined

        Object.entries(this.assets).some(([, pipelines]) => {
            Object.entries(pipelines).some(([key, pipeline]) => {
                if (pipeline.proxy === address) {
                    pipelineType = key
                    return true
                }
                return false
            })
            return false
        })

        if (pipelineType === undefined) {
            Object.entries(this.multiAssets).some(([key, pipeline]) => {
                if (pipeline.proxy === address) {
                    pipelineType = `multi_${key}`
                    return true
                }
                return false
            })
        }

        return pipelineType
    }

    /**
     * Returns list of the cached tokens list.
     * @returns {TokensAssetsStoreData['tokens']}
     */
    public get tokens(): TokensAssetsStoreData['tokens'] {
        return this.data.tokens
    }

    /**
     * Returns filtered tokens by the given `chainId`
     * @param {string} chainId
     */
    public filterTokensByChainId(chainId: string): TokensAssetsStoreData['tokens'] {
        return this.tokens.filter(
            token => token.chainId === chainId || token.pipelines.some(
                pipeline => pipeline.chainId === chainId,
            ),
        )
    }

    /**
     * Returns token by the given vault `address` and `chainId`
     * @param {string} address
     * @param {string} chainId
     */
    public findTokenByVaultAddress(
        address: string,
        chainId: string,
    ): TokensAssetsStoreData['tokens'][number] | undefined {
        return this.tokens.find(
            token => token.pipelines.some(
                pipeline => (
                    pipeline.vault.toLowerCase() === address.toLowerCase()
                    && pipeline.chainId === chainId
                ),
            ),
        )
    }

    /**
     * Returns token root from bridge assets by the given Evm token `root` and network `chainId`
     * @param {string} root
     * @param {string} chainId
     */
    public findAssetRootByVaultTokenAndChain(root: string, chainId: string): string | undefined {
        let assetRoot: string | undefined
        Object.entries(this.assets).some(
            ([tokenRoot, pipelines]) => Object.values(pipelines).some(
                pipeline => pipeline.vaults.some(vault => {
                    if (vault.token === root && vault.chainId === chainId) {
                        assetRoot = tokenRoot
                        return true
                    }
                    return false
                }),
            ),
        )
        return assetRoot
    }

    /**
     * Returns Everscale token wallet Contract by the given token `root`
     * @param {string} root
     */
    public async getTokenWalletContract(root: string): Promise<Contract<typeof TokenAbi.Wallet> | undefined> {
        let wallet = this.get('everscale', '1', root)?.wallet

        if (wallet === undefined) {
            await this.syncEverscaleTokenWallet(root)
        }

        wallet = this.get('everscale', '1', root)?.wallet

        if (wallet === undefined) {
            return undefined
        }

        return new rpc.Contract(TokenAbi.Wallet, new Address(wallet))
    }

    /**
     * Returns ERC20 token Contract by the given Evm`vault` address and network `chainId`
     * @param {string} root
     * @param {string} chainId
     */
    public getEvmTokenContract(root: string, chainId: string): EthContract | undefined {
        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.ERC20, root)
        }

        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, root)
    }

    /**
     * Returns EVM Vault Contract by the given `vault` address and network `chainId`
     * @param {string} vault
     * @param {string} chainId
     */
    public getEvmTokenVaultContract(vault: string, chainId: string): EthContract | undefined {
        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.Vault, vault)
        }

        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.Vault, vault)
    }

    /**
     * Returns EVM MultiVault Contract by the given `vault` address and network `chainId`
     * @param {string} vault
     * @param {string} chainId
     */
    public getEvmTokenMultiVaultContract(vault: string, chainId: string): EthContract | undefined {
        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.MultiVault, vault)
        }

        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.MultiVault, vault)
    }

    /**
     * Sync token balance with balance in the network by the given token root address.
     * Pass `true` in second parameter to force update.
     * @param {string} root
     * @returns {Promise<void>}
     */
    public async syncEverscaleToken(root: string): Promise<void> {
        if (this.everWallet.address === undefined) {
            return
        }

        const token = this.get('everscale', '1', root)

        if (token === undefined) {
            return
        }

        if (token.wallet === undefined) {
            try {
                await this.syncEverscaleTokenWallet(root)
            }
            catch (e) {
                error('Sync token wallet address error', e)
                runInAction(() => {
                    token.wallet = undefined
                })
            }
        }

        if (token.wallet !== undefined) {
            try {
                await this.syncEverscaleTokenBalance(root)
            }
            catch (e) {
                warn('Sync token balance error', e)
                runInAction(() => {
                    token.balance = undefined
                })
            }
        }
    }

    /**
     * Update token wallet address by the given token root address and current wallet address.
     * @param {string} root
     */
    public async syncEverscaleTokenWallet(root: string): Promise<void> {
        if (root === undefined || this.everWallet.account?.address === undefined) {
            return
        }

        const token = this.get('everscale', '1', root)

        if (token === undefined) {
            return
        }

        if (token.wallet === undefined) {
            try {
                const address = await TokenWallet.walletAddress({
                    owner: this.everWallet.account.address,
                    root: new Address(token.root),
                })

                // Force update
                runInAction(() => {
                    token.wallet = address.toString()
                })
            }
            catch (e) {
                error('Token wallet address update error', e)
            }
        }
    }

    /**
     * Directly update token balance by the given token root address.
     * It updates balance in the tokens list.
     * @param {string} root
     */
    public async syncEverscaleTokenBalance(root: string): Promise<void> {
        if (root === undefined) {
            return
        }

        const token = this.get('everscale', '1', root)

        if (token === undefined || token.wallet === undefined) {
            return
        }

        try {
            const balance = await TokenWallet.balance({
                wallet: new Address(token.wallet),
            })

            // Force update
            runInAction(() => {
                token.balance = balance
            })
        }
        catch (e: any) {
            warn('Cannot update token balance. Wallet account of this token not created yet ->', e.message)
            runInAction(() => {
                token.balance = undefined
            })
        }
    }

    /**
     * Sync EVM token data by the given Evm token `root` address
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmToken(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined) {
            return
        }

        try {
            await Promise.all([
                this.syncEvmTokenDecimals(root, pipeline),
                this.syncEvmTokenBalance(root, pipeline),
            ])
        }
        catch (e) {
            error('Sync EVM token error', e)
        }
    }

    /**
     * Sync EVM token address by the given Everscale token `root` address and `pipeline`
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenAddress(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline?.chainId === undefined || root === pipeline?.evmTokenAddress) {
            return
        }

        let evmTokenAddress: string | undefined
        if (pipeline.isMultiVault) {
            if (pipeline.isNative) {
                evmTokenAddress = await this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                    .getNativeToken(
                        root.split(':')[0],
                        `0x${root.split(':')[1]}`,
                    )
                    .call()
            }
            else {
                await staticRpc.ensureInitialized()
                const rootContract = new staticRpc.Contract(TokenAbi.TokenRootAlienEVM, new Address(root))
                const meta = await rootContract.methods.meta({ answerId: 0 }).call()
                evmTokenAddress = `0x${new BigNumber(meta.base_token)
                    .toString(16)
                    .padStart(40, '0')}`
            }
        }
        else {
            evmTokenAddress = await this.getEvmTokenVaultContract(pipeline.vault, pipeline.chainId)?.methods
                .token()
                .call()
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenAddress = evmTokenAddress?.toLowerCase()
        })
    }

    /**
     * Sync EVM token decimals by the given Evm token `root` address and `pipeline`
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenDecimals(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline?.chainId === undefined) {
            return
        }

        const evmTokenDecimals = await this.getEvmTokenDecimals(root, pipeline.chainId)

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenDecimals = evmTokenDecimals
        })
    }

    public async getEvmTokenDecimals(root: string, chainId: string): Promise<number> {
        return parseInt(
            await this.getEvmTokenContract(root, chainId)?.methods
                .decimals()
                .call(),
            10,
        )
    }

    public async getEvmTokenName(root: string, chainId: string): Promise<string> {
        return this.getEvmTokenContract(root, chainId)?.methods
            .name()
            .call()
    }

    public async getEvmTokenSymbol(root: string, chainId: string): Promise<string> {
        return this.getEvmTokenContract(root, chainId)?.methods
            .symbol()
            .call()
    }

    /**
     * Sync EVM token balance by the given Evm token `root` address and `pipeline`
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenBalance(root?: string, pipeline?: Pipeline): Promise<void> {
        if (this.evmWallet.address === undefined || root === undefined || pipeline?.chainId === undefined) {
            return
        }

        const evmTokenBalance = await this.getEvmTokenContract(root, pipeline.chainId)?.methods
            .balanceOf(this.evmWallet.address)
            .call()

        if (evmTokenBalance === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenBalance = evmTokenBalance
        })
    }

    /**
     * Sync token accessibility flags, metadata and fee by the given Evm token `root`
     * and `pipeline` in Multi Vault
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenMultiVaultMeta(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline?.chainId === undefined) {
            return
        }

        const meta = await this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
            .tokens(root)
            .call()

        let { depositFee, withdrawFee } = meta

        // eslint-disable-next-line eqeqeq
        if (meta.activation == '0') {
            if (pipeline.tokenBase === 'evm') {
                [depositFee, withdrawFee] = await Promise.all([
                    this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                        .defaultAlienDepositFee()
                        .call(),
                    this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                        .defaultAlienWithdrawFee()
                        .call(),
                ])
            }
            else {
                [depositFee, withdrawFee] = await Promise.all([
                    this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                        .defaultNativeDepositFee()
                        .call(),
                    this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                        .defaultNativeWithdrawFee()
                        .call(),
                ])
            }
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.depositFee = depositFee
            // eslint-disable-next-line no-param-reassign
            pipeline.isBlacklisted = meta?.blacklisted
            // eslint-disable-next-line no-param-reassign
            pipeline.isNative = pipeline?.isNative === undefined ? meta?.isNative : pipeline.isNative
            // eslint-disable-next-line no-param-reassign
            pipeline.withdrawFee = withdrawFee
        })
    }

    /**
     * Sync EVM token vault balance by the given Evm token `root` address and `pipeline`.
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenVaultBalance(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline?.chainId === undefined) {
            return
        }

        const vaultBalance = await this.getEvmTokenContract(root, pipeline.chainId)?.methods
            .balanceOf(pipeline.vault)
            .call()

        if (vaultBalance === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.vaultBalance = vaultBalance
        })
    }

    /**
     * Sync EVM token vault balance limit by the given Evm token `vault` address and `pipeline`.
     * @param {string} [vault]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenVaultLimit(vault?: string, pipeline?: Pipeline): Promise<void> {
        if (vault === undefined || pipeline?.chainId === undefined) {
            return
        }

        const vaultLimit = await this.getEvmTokenVaultContract(vault, pipeline.chainId)?.methods
            .availableDepositLimit()
            .call()

        if (vaultLimit === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.vaultLimit = vaultLimit
        })
    }

    /**
     * Sync Everscale token address by the given Evm token `root` address and `pipeline`
     * @param [root]
     * @param [pipeline]
     */
    public async syncEverscaleTokenAddress(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined) {
            return
        }

        let everscaleTokenAddress: string | undefined

        if (pipeline.isNative) {
            const result = (await this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                .natives(root)
                .call())
            everscaleTokenAddress = result !== undefined
                ? `${result.wid}:${new BigNumber(result.addr).toString(16).padStart(64, '0')}`
                : undefined
        }
        else {
            const token = this.get('evm', pipeline.chainId, root)

            if (token?.chainId === undefined || token.name === undefined) {
                return
            }

            await staticRpc.ensureInitialized()

            everscaleTokenAddress = (await alienTokenProxyContract(staticRpc, pipeline.proxy).methods
                .deriveAlienTokenRoot({
                    answerId: 0,
                    chainId: token.chainId,
                    decimals: token.decimals,
                    name: token.name,
                    symbol: token.symbol,
                    token: root,
                })
                .call())
                .value0
                .toString()

            const canonicalEverscaleTokenAddress = await getCanonicalToken({ ...pipeline, everscaleTokenAddress })

            if (canonicalEverscaleTokenAddress !== undefined) {
                everscaleTokenAddress = canonicalEverscaleTokenAddress
            }
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.everscaleTokenAddress = everscaleTokenAddress?.toLowerCase()
        })
    }

    /**
     * Fetch Bridge assets
     * @param {string} uri
     */
    public async fetchAssets(uri: string): Promise<void> {
        if (this.isFetchingAssets) {
            return
        }

        this.setState({
            isFetchingAssets: true,
            isReady: false,
        })

        fetch(uri, { method: 'GET' }).then(
            value => value.json(),
        ).then((value: BridgeTokenAssetsManifest) => {
            this.setData({
                assets: value.token,
                multiAssets: value.multitoken,
            })
            this.setState({
                isFetchingAssets: false,
                isReady: Object.keys(value.token).length > 0
                    && 'multitoken' in value ? Object.keys(value.multitoken).length > 0 : true,
            })
        }).catch(reason => {
            error('Cannot load bridge token assets list', reason)
            this.setState({
                isFetchingAssets: false,
                isReady: false,
            })
        })
    }

    public get isFetchingAssets(): TokensAssetsStoreState['isFetchingAssets'] {
        return this.state.isFetchingAssets
    }

    /**
     *
     */
    public get isReady(): TokensAssetsStoreState['isReady'] {
        return this.state.isReady
    }

}


let service: TokensAssetsService

export function useTokensAssets(): TokensAssetsService {
    if (service === undefined) {
        service = new TokensAssetsService(
            useEverWallet(),
            useEvmWallet(),
            {
                alienTokensLists: [
                    new TokensListService(BridgeAssetsURI),
                    new TokensListService(AlienTokenListURI),
                ],
                assetsUri: TokenAssetsURI,
                primaryTokensList: new TokensListService(TokenListURI),
            },
        )
    }
    return service
}
