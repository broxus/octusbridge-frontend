import { Address, Contract, ProviderRpcClient } from 'everscale-inpage-provider'
import {
    computed,
    makeObservable,
    override,
    reaction,
    runInAction,
} from 'mobx'
import Web3 from 'web3'
import { Contract as EthContract } from 'web3-eth-contract'

import { AlienTokenListURI, TokenAssetsURI, TokenListURI } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { EthAbi, MultiVault } from '@/misc'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, TokensCacheState } from '@/stores/TokensCacheService'
import { TokensListService } from '@/stores/TokensListService'
import { NetworkType, Token } from '@/types'
import {
    error,
    findNetwork,
    getEverscaleMainNetwork,
    isEverscaleAddressValid,
    isEvmAddressValid,
} from '@/utils'


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
    pipelines: Pipeline[];
}

export type Pipeline = {
    depositType: string;
    chainId: string;
    ethereumConfiguration: Address;
    everscaleConfiguration?: Address;
    everscaleTokenAddress?: string;
    evmTokenAddress?: string;
    evmTokenBalance?: string;
    evmTokenDecimals?: number;
    from: string;
    isBlacklisted: boolean;
    isMultiVault: boolean;
    isNative: boolean;
    proxy: string;
    to: string;
    tokenBase: string;
    vault: string;
    vaultBalance?: string;
    vaultLimit?: string;
    withdrawFee?: string;
}

export type ComposedPipelinesHash = {
    [composedKey: string]: Pipeline;
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


export function alienTokenProxyContract(
    provider: ProviderRpcClient,
    root: string,
): Contract<typeof MultiVault.AlienProxy> {
    return new Contract(provider, MultiVault.AlienProxy, new Address(root))
}

export function nativeTokenProxyContract(
    provider: ProviderRpcClient,
    root: string,
): Contract<typeof MultiVault.NativeProxy> {
    return new Contract(provider, MultiVault.NativeProxy, new Address(root))
}


export class TokensAssetsService extends TokensCacheService<TokenAsset, TokensAssetsStoreData, TokensAssetsStoreState> {

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly _options: TokensAssetsServiceCtorOptions,
    ) {
        const {
            assetsUri,
            primaryTokensList,
        } = _options

        super(everWallet, primaryTokensList, { useBuildListener: false })

        this.setData({
            assets: {},
            multiAssets: {},
        })

        this.setState('isFetchingAssets', false)

        makeObservable<TokensAssetsService, '_byRoot'>(this, {
            _byRoot: override,
            pipelines: computed,
        })

        // When the Tokens List Service has loaded the list of
        // available tokens, we will start creating a token map
        reaction(
            () => [primaryTokensList.time, primaryTokensList.tokens, everWallet.address],
            async (
                [time, tokens, address],
                [prevTime, prevTokens, prevAddress],
            ) => {
                if (time !== prevTime || tokens !== prevTokens || address !== prevAddress) {
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

        this.setState('isReady', false)

        this.tokensList.tokens.forEach(token => {
            const cachedToken = this.get(token.address?.toLowerCase?.())

            this.add({
                decimals: token.decimals,
                icon: token.logoURI,
                name: token.name,
                pipelines: cachedToken?.pipelines || [],
                root: token.address?.toLowerCase?.(),
                symbol: token.symbol,
                updatedAt: -1,
                vendor: token.vendor,
                verified: token.verified,
            })

            this.buildPipeline(token.address.toLowerCase?.())
        })

        const alienTokens: TokenAsset[] = this.tokens.slice()

        this._options.alienTokensLists?.forEach(list => {
            list.tokens.forEach(token => {
                const cachedToken = this.get(token.address?.toLowerCase?.())

                if (cachedToken === undefined) {
                    alienTokens.push({
                        chainId: token.chainId.toString(),
                        decimals: token.decimals,
                        icon: token.logoURI,
                        name: token.name,
                        pipelines: [],
                        root: token.address?.toLowerCase?.(),
                        symbol: token.symbol,
                        updatedAt: -1,
                        vendor: token.vendor,
                        verified: token.verified,
                    })
                }
            })
        })

        this.setData('tokens', alienTokens)
        this.setState('isReady', true)
    }

    /**
     * Returns tokens map where key is a token root address.
     * @protected
     */
    protected get _byRoot(): Record<string, TokensAssetsStoreData['tokens'][number]> {
        const entries: Record<string, TokensAssetsStoreData['tokens'][number]> = {}
        this.tokens.forEach(token => {
            entries[token.root?.toLowerCase?.()] = token
        })
        return entries
    }

    /**
     * Build token pipelines
     * @param {string} [root]
     */
    public buildPipeline(root?: string): void {
        const tokenRoot = root?.toLowerCase?.()

        if (tokenRoot === undefined/* || (isEverscaleAddressValid(tokenRoot) && !(tokenRoot in this.data.assets)) */) {
            return
        }

        const token = this.get(tokenRoot)

        if (token === undefined) {
            return
        }

        const bridgeAssets = this.data.assets[tokenRoot]
        const assets = bridgeAssets || this.data.multiAssets
        const isMultiVault = bridgeAssets === undefined && this.data.multiAssets !== undefined

        const pipelinesHash: Record<string, Pipeline> = {}

        token?.pipelines.forEach(pipeline => {
            pipelinesHash[`${tokenRoot}-${pipeline.from}-${pipeline.to}-${pipeline.depositType}`] = pipeline
        })

        const everscaleMainNetwork = getEverscaleMainNetwork()
        const everscaleMainNetworkId = `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`

        runInAction(() => {
            token.pipelines = Object.entries({ ...assets }).reduce(
                (acc: Pipeline[], [key, pipeline]) => {
                    const [tokenBase, to] = key.split('_') as NetworkType[]
                    pipeline.vaults.forEach(vault => {
                        const firstFrom = tokenBase === 'everscale'
                            ? everscaleMainNetworkId
                            : `${tokenBase}-${vault.chainId}`
                        const firstTo = to === 'everscale' ? everscaleMainNetworkId : `${to}-${vault.chainId}`
                        const secondFrom = to === 'everscale' ? everscaleMainNetworkId : `${to}-${vault.chainId}`
                        const secondTo = tokenBase === 'everscale'
                            ? everscaleMainNetworkId
                            : `${tokenBase}-${vault.chainId}`

                        const firstCached = this.pipeline(tokenRoot, firstFrom, firstTo, vault.depositType)
                        const secondCached = this.pipeline(tokenRoot, secondFrom, secondTo, vault.depositType)

                        const isEverscaleToken = isEverscaleAddressValid(tokenRoot)
                        const isEvmToken = isEvmAddressValid(tokenRoot)

                        const pl = {
                            chainId: vault.chainId,
                            depositType: vault.depositType,
                            ethereumConfiguration: new Address(vault.ethereumConfiguration),
                            everscaleTokenAddress: isEverscaleToken ? tokenRoot : undefined,
                            evmTokenAddress: isEvmToken ? tokenRoot : undefined,
                            isBlacklisted: false,
                            isMultiVault,
                            isNative: false,
                            proxy: pipeline.proxy,
                            tokenBase,
                            vault: vault.vault,
                        }

                        acc.push({
                            ...pl,
                            everscaleConfiguration: firstCached?.everscaleConfiguration,
                            evmTokenDecimals: firstCached?.evmTokenDecimals || (
                                isEvmToken ? token.decimals : undefined
                            ),
                            vaultBalance: firstCached?.vaultBalance,
                            vaultLimit: firstCached?.vaultLimit,
                            from: firstFrom,
                            to: firstTo,
                        })
                        // We should not revert pipelines for multi-vault tokens
                        if (!isMultiVault) {
                            acc.push({
                                ...pl,
                                everscaleConfiguration: secondCached?.everscaleConfiguration,
                                evmTokenDecimals: secondCached?.evmTokenDecimals || (
                                    isEvmToken ? token.decimals : undefined
                                ),
                                vaultBalance: secondCached?.vaultBalance,
                                vaultLimit: secondCached?.vaultLimit,
                                from: secondFrom,
                                to: secondTo,
                            })
                        }
                    })
                    return acc
                },
                [],
            )
        })
    }

    /**
     * Returns hash of all possible pipelines
     * @returns {ComposedPipelinesHash}
     */
    public get pipelines(): ComposedPipelinesHash {
        const pipelines: ComposedPipelinesHash = {}
        this.tokens.forEach(token => {
            token.pipelines.forEach(pipeline => {
                pipelines[`${token.root}-${pipeline.from}-${pipeline.to}-${pipeline.depositType}`] = pipeline
            })
        })
        return pipelines
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
        return this.pipelines[`${root}-${from}-${to}-${depositType}`]
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

     * Returns ERC20 token Contract by the given Evm`vault` address and network `chainId`
     * @param {string} root
     * @param {string} chainId
     */
    public getEvmTokenContract(root: string, chainId: string): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.ERC20, root)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.ERC20, root)
    }

    /**
     * Returns EVM Vault Contract by the given `vault` address and network `chainId`
     * @param {string} vault
     * @param {string} chainId
     */
    public getEvmTokenVaultContract(vault: string, chainId: string): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.Vault, vault)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.Vault, vault)
    }

    /**
     * Returns EVM MultiVault Contract by the given `vault` address and network `chainId`
     * @param {string} vault
     * @param {string} chainId
     */
    public getEvmTokenMultiVaultContract(vault: string, chainId: string): EthContract | undefined {
        if (this.evmWallet.web3 === undefined) {
            return undefined
        }

        const network = findNetwork(chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.MultiVault, vault)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.MultiVault, vault)
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

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const evmTokenAddress = await this.getEvmTokenVaultContract(pipeline.vault, pipeline.chainId)?.methods
            .token()
            .call()

        // Force update
        runInAction(() => {
            token.pipelines = token.pipelines.map(
                p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? { ...p, evmTokenAddress } : p),
            )

            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenAddress = evmTokenAddress
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

        const evmTokenDecimals = parseInt(
            await this.getEvmTokenContract(root, pipeline.chainId)?.methods
                .decimals()
                .call(),
            10,
        )

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenDecimals = evmTokenDecimals
        })
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

        let { withdrawFee } = meta

        // eslint-disable-next-line eqeqeq
        if (meta.activation == '0') {
            withdrawFee = await this.getEvmTokenMultiVaultContract(pipeline.vault, pipeline.chainId)?.methods
                .defaultWithdrawFee()
                .call()
        }

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.isBlacklisted = meta?.blacklisted
            // eslint-disable-next-line no-param-reassign
            pipeline.isNative = meta?.isNative
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

        const token = this.get(root)

        if (token?.chainId === undefined || token.name === undefined) {
            return
        }

        const contract = alienTokenProxyContract(rpc, pipeline.proxy)

        const everscaleTokenAddress = (await contract.methods
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

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.everscaleTokenAddress = everscaleTokenAddress.toString()
        })
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
            this.setData({
                assets: value.token,
                multiAssets: value.multitoken,
            })
            this.setState('isFetchingAssets', false)
        }).catch(reason => {
            error('Cannot load bridge token assets list', reason)
            this.setState('isFetchingAssets', false)
        })
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
                    new TokensListService(AlienTokenListURI),
                ],
                assetsUri: TokenAssetsURI,
                primaryTokensList: new TokensListService(TokenListURI),
            },
        )
    }
    return service
}
