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

export type TokenAssetVault = TokenRawAssetVault & {
    balance?: string;
    decimals?: number;
    limit?: string;
    tokenAddress?: string;
    tokenBalance?: string;
}

export type TokenPipeline = {
    proxy: string;
    vaults: TokenAssetVault[];
}

export type TokenPipelines = {
    [pipeline: string]: TokenPipeline;
}

export type TokenAsset = Token & {
    pipelines: Pipeline[];
}

export type Pipeline = {
    depositType: string;
    chainId?: string;
    ethereumConfiguration: string;
    everscaleConfiguration?: Address;
    everscaleTokenAddress?: string;
    evmTokenAddress?: string;
    evmTokenBalance?: string;
    evmTokenDecimals?: number;
    from: string;
    isNative: boolean;
    proxy: string;
    to: string;
    tokenBase: string;
    vault: string;
    vaultBalance?: string;
    vaultLimit?: string;
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


function alienTokenProxyContract(provider: ProviderRpcClient, root: string): Contract<typeof MultiVault.ProxyAlien> {
    return new Contract(provider, MultiVault.ProxyAlien, new Address(root))
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
            const cachedToken = this.get(token.address)

            this.add({
                decimals: token.decimals,
                icon: token.logoURI,
                name: token.name,
                pipelines: cachedToken?.pipelines || [],
                root: token.address,
                symbol: token.symbol,
                updatedAt: -1,
                vendor: token.vendor,
                verified: token.verified,
            })

            this.buildPipeline(token.address)
        })

        const alienTokens: TokenAsset[] = this.tokens.slice()

        this._options.alienTokensLists?.forEach(list => {
            list.tokens.forEach(token => {
                const cachedToken = this.get(token.address)

                if (cachedToken === undefined) {
                    alienTokens.push({
                        chainId: token.chainId.toString(),
                        decimals: token.decimals,
                        icon: token.logoURI,
                        name: token.name,
                        pipelines: [],
                        root: token.address,
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
            entries[token.root] = token
        })
        return entries
    }

    /**
     * Build token pipelines
     * @param {string} [root]
     */
    public buildPipeline(root?: string): void {
        if (root === undefined || (isEverscaleAddressValid(root) && !(root in this.data.assets))) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const assets = this.data.assets[token.root] || this.data.multiAssets

        const pipelinesHash: Record<string, Pipeline> = {}

        token?.pipelines.forEach(pipeline => {
            pipelinesHash[`${token.root}-${pipeline.from}-${pipeline.to}-${pipeline.depositType}`] = pipeline
        })

        const everscaleMainNetwork = getEverscaleMainNetwork()
        const everscaleMainNetworkId = `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`

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

                    const firstCached = this.pipeline(token.root, firstFrom, firstTo, vault.depositType)
                    const secondCached = this.pipeline(token.root, secondFrom, secondTo, vault.depositType)

                    const isEverscaleToken = isEverscaleAddressValid(token.root)
                    const isEvmToken = isEvmAddressValid(token.root)

                    const pl = {
                        chainId: vault.chainId,
                        depositType: vault.depositType,
                        ethereumConfiguration: vault.ethereumConfiguration,
                        everscaleTokenAddress: isEverscaleToken ? token.root : undefined,
                        evmTokenAddress: isEvmToken ? token.root : vault.tokenAddress,
                        isNative: false,
                        proxy: pipeline.proxy,
                        tokenBase,
                        vault: vault.vault,
                    }

                    acc.push({
                        ...pl,
                        everscaleConfiguration: firstCached?.everscaleConfiguration,
                        evmTokenDecimals: firstCached?.evmTokenDecimals || (
                            isEvmToken ? token.decimals : vault.decimals
                        ),
                        vaultBalance: firstCached?.vaultBalance || vault.balance,
                        vaultLimit: firstCached?.vaultLimit || vault.limit,
                        from: firstFrom,
                        to: firstTo,
                    }, {
                        ...pl,
                        everscaleConfiguration: secondCached?.everscaleConfiguration,
                        evmTokenDecimals: secondCached?.evmTokenDecimals || (
                            isEvmToken ? token.decimals : vault.decimals
                        ),
                        vaultBalance: secondCached?.vaultBalance || vault.balance,
                        vaultLimit: secondCached?.vaultLimit || vault.limit,
                        from: secondFrom,
                        to: secondTo,
                    })
                })
                return acc
            },
            [],
        )
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
     * Returns token by the given vault `address`, `chainId` and optional `pipeline` key
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
     * If EVM Wallet is connected, web3 service is defined, token vault exist, vault has token
     * address (sync, if it has not) - returns `ERC20 Contract`, otherwise `undefined`
     * @param {string} root
     * @param {Pipeline} [pipeline]
     */
    public async getEvmTokenContract(root: string, pipeline?: Pipeline): Promise<EthContract | undefined> {
        if (this.evmWallet.web3 === undefined || pipeline?.chainId === undefined) {
            return undefined
        }

        if (pipeline?.evmTokenAddress === undefined) {
            await this.syncEvmTokenAddress(root)
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
     * Returns EVM token Vault Contract by the given `pipeline`
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
     * Returns EVM token MultiVault Contract by the given `pipeline`
     * @param {Pipeline} [pipeline]
     */
    public getEvmTokenMultiVaultContract(pipeline?: Pipeline): EthContract | undefined {
        if (this.evmWallet.web3 === undefined || pipeline?.chainId === undefined) {
            return undefined
        }

        const network = findNetwork(pipeline.chainId, 'evm')

        if (network?.rpcUrl !== undefined && this.evmWallet.chainId !== pipeline.chainId) {
            const web3 = new Web3(new Web3.providers.HttpProvider(network.rpcUrl))
            return new web3.eth.Contract(EthAbi.MultiVault, pipeline.vault)
        }

        return new this.evmWallet.web3.eth.Contract(EthAbi.MultiVault, pipeline.vault)
    }

    /**
     * Sync EVM token data by the given Everscale or Evm token `root` address
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmToken(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined) {
            return
        }

        if (isEverscaleAddressValid(root)) {
            try {
                await this.syncEvmTokenAddress(root, pipeline)
            }
            catch (e) {
                error('Sync EVM token address error', e)
                return
            }
        }

        try {
            await this.syncEvmTokenDecimals(root, pipeline)
        }
        catch (e) {
            error('Sync EVM token decimals error', e)
        }

        try {
            await this.syncEvmTokenBalance(root, pipeline)
        }
        catch (e) {
            error('Sync EVM token balance error', e)
        }

        if (isEvmAddressValid(root)) {
            try {
                await this.syncEvmTokenType(root, pipeline)
            }
            catch (e) {
                error('Sync EVM token type error', e)
            }
        }

        // try {
        //     await this.syncEvmTokenVaultLimit(root, pipeline)
        // }
        // catch (e) {
        //     // error('Sync EVM token vault limit error', e)
        // }
    }

    /**
     * Sync EVM token address by the given Everscale token `root` address and `pipeline`
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenAddress(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined || root === pipeline.evmTokenAddress) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const evmTokenAddress = await this.getEvmTokenVaultContract(pipeline)?.methods.token().call()

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
     * Sync EVM token decimals by the given Everscale token `root` address and `pipeline`
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenDecimals(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined || pipeline?.evmTokenDecimals !== undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenContract = await this.getEvmTokenContract(root, pipeline)

        const evmTokenDecimals = parseInt((await tokenContract?.methods.decimals().call()), 10)

        // Force update
        runInAction(() => {
            token.pipelines = token.pipelines.map(
                p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? { ...p, evmTokenDecimals } : p),
            )

            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenDecimals = evmTokenDecimals
        })
    }

    /**
     * Sync EVM token balance by the given Everscale token `root` address and `pipeline`
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenBalance(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenContract = await this.getEvmTokenContract(root, pipeline)

        const evmTokenBalance = await tokenContract?.methods.balanceOf(this.evmWallet.address).call()

        if (evmTokenBalance === undefined) {
            return
        }

        // Force update
        runInAction(() => {
            token.pipelines = token.pipelines.map(
                p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? { ...p, evmTokenBalance } : p),
            )

            // eslint-disable-next-line no-param-reassign
            pipeline.evmTokenBalance = evmTokenBalance
        })
    }

    /**
     * Sync Multi token type
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenType(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenInfo = await this.getEvmTokenMultiVaultContract(pipeline)?.methods.tokens(root).call()

        // Force update
        runInAction(() => {
            token.pipelines = token.pipelines.map(
                p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? {
                    ...p, isNative: tokenInfo?.isNative,
                } : p),
            )

            // eslint-disable-next-line no-param-reassign
            pipeline.isNative = tokenInfo?.isNative
        })
    }

    /**
     * Sync EVM token vault balance by the given token `root` address and `chainId`.
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenVaultBalance(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenContract = await this.getEvmTokenContract(root, pipeline)

        const vaultBalance = await tokenContract?.methods.balanceOf(pipeline.vault).call()

        if (vaultBalance === undefined) {
            return
        }

        const pipelines = token.pipelines.map(
            p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? { ...p, vaultBalance } : p),
        )

        this.update(root, 'pipelines', pipelines)

        // Force update
        runInAction(() => {
            // eslint-disable-next-line no-param-reassign
            pipeline.vaultBalance = vaultBalance
        })
    }

    /**
     * Sync EVM token vault balance limit by the given token root address and chainId.
     * @param {string} [root]
     * @param {Pipeline} [pipeline]
     */
    public async syncEvmTokenVaultLimit(root?: string, pipeline?: Pipeline): Promise<void> {
        if (root === undefined || pipeline === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const tokenVaultContract = this.getEvmTokenVaultContract(pipeline)

        const vaultLimit = await tokenVaultContract?.methods.availableDepositLimit().call()

        if (vaultLimit === undefined) {
            return
        }

        const pipelines = token.pipelines.map(
            p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? { ...p, vaultLimit } : p),
        )

        this.update(root, 'pipelines', pipelines)

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

        if (token === undefined) {
            return
        }

        const everscaleTokenAddress = (await alienTokenProxyContract(rpc, root).methods.deriveAlienTokenRoot({
            answerId: 0,
            chainId: token.chainId?.toString() as string,
            decimals: token.decimals,
            name: token.name as string,
            symbol: token.symbol,
            token: root,
        }).call()).value0

        const pipelines = token.pipelines.map(
            p => ((p.chainId === pipeline.chainId && p.vault === pipeline.vault) ? {
                ...p, everscaleTokenAddress: everscaleTokenAddress.toString(),
            } : p),
        )

        this.update(root, 'pipelines', pipelines)

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
