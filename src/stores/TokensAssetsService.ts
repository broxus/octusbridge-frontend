import {
    computed,
    makeObservable,
    override, reaction,
    runInAction,
} from 'mobx'
import { Address } from 'everscale-inpage-provider'
import { Contract as EthContract } from 'web3-eth-contract'
import Web3 from 'web3'

import {
    EthAbi,
} from '@/misc'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, TokensCacheState } from '@/stores/TokensCacheService'
import { TokensListService } from '@/stores/TokensListService'
import { NetworkType, Token } from '@/types'
import { error, findNetwork, getEverscaleMainNetwork } from '@/utils'
import { AlienTokenListURI, TokenAssetsURI } from '@/config'


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

export type TokenRawPipelines = {
    [pipeline: string]: {
        proxy: string;
        vaults: TokenRawAssetVault[];
    }
}

export type TokenAssetVault = TokenRawAssetVault & {
    balance?: string;
    decimals?: number;
    limit?: string;
    tokenAddress?: string;
    tokenBalance?: string;
}

export type TokenPipelines = {
    [pipeline: string]: {
        proxy: string;
        vaults: TokenAssetVault[];
    }
}

export type TokenAsset = Token & {
    pipelines: TokenPipelines;
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

export type TokensAssets = {
    [tokenRoot: string]: TokenPipelines;
}

type TokensAssetsStoreData = {
    assets: TokensAssets;
    pipelines: Pipeline[];
    tokens: TokenAsset[];
}

type TokensAssetsStoreState = TokensCacheState<TokenAsset> & {
    isFetchingAssets: boolean;
}


export class TokensAssetsService extends TokensCacheService<TokenAsset, TokensAssetsStoreData, TokensAssetsStoreState> {

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensList: TokensListService,
        protected readonly tokensAssetsURI: string,
    ) {
        super(everWallet, tokensList)

        this.setData({
            assets: {},
            pipelines: [],
            tokens: [],
        })

        this.setState({
            isFetchingAssets: false,
            isReady: false,
            updatingTokens: new Map<string, boolean>(),
            updatingTokensBalance: new Map<string, boolean>(),
            updatingTokensWallet: new Map<string, boolean>(),
        })

        makeObservable<TokensAssetsService, '_byRoot'>(this, {
            _byRoot: override,
            pipelines: computed,
        })

        // When the Tokens List Service has loaded the list of
        // available tokens, we will start creating a token map
        reaction(
            () => [tokensList.time, tokensList.tokens.length, everWallet.address],
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
            this.setState('isReady', false)
            return
        }

        this.setState('isReady', false)

        this.setData(
            'tokens',
            this.tokensList.tokens.map(token => {
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
                    name: token.name,
                    pipelines,
                    root: token.address,
                    symbol: token.symbol,
                    updatedAt: -1,
                    vendor: token.vendor,
                    verified: token.verified,
                }
            }),
        )

        const everscaleMainNetwork = getEverscaleMainNetwork()
        const everscaleMainNetworkId = `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`

        const pipelinesHash: Record<string, Pipeline> = {}

        this.pipelines.forEach(pipeline => {
            pipelinesHash[`${pipeline.everscaleTokenRoot}-${pipeline.vault}`] = pipeline
        })

        this.setData(
            'pipelines',
            Object.entries(this.assets).reduce(
                (acc: Pipeline[], [tokenRoot, pipelines]) => {
                    Object.entries(pipelines).forEach(([key, pipeline]) => {
                        const [tokenBase, to] = key.split('_') as NetworkType[]
                        pipeline.vaults.forEach(vault => {
                            const cached = pipelinesHash[`${tokenRoot}-${vault.vault}`]
                            const pl = {
                                chainId: vault.chainId,
                                depositType: vault.depositType,
                                ethereumConfiguration: vault.ethereumConfiguration,
                                everscaleConfiguration: cached?.everscaleConfiguration,
                                everscaleTokenRoot: tokenRoot,
                                evmTokenAddress: vault.tokenAddress,
                                evmTokenDecimals: cached?.evmTokenDecimals || vault.decimals,
                                proxy: pipeline.proxy,
                                tokenBase,
                                vault: vault.vault,
                                vaultBalance: cached?.vaultBalance || vault.balance,
                                vaultLimit: cached?.vaultLimit || vault.limit,
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
     * Returns Bridge token assets.
     * @returns {TokensAssetsStoreData['assets']}
     */
    public get assets(): TokensAssetsStoreData['assets'] {
        return this.data.assets
    }

    /**
     * Returns List of all possible pipelines
     * @returns {Pipeline[]}
     */
    public get pipelines(): TokensAssetsStoreData['pipelines'] {
        return this.data.pipelines
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
     * Returns filtered tokens by the given `chainId` and optional `pipeline` key
     * @param {string} chainId
     * @param {string} [pipeline]
     */
    public filterTokensByChainId(chainId: string, pipeline?: string): TokensAssetsStoreData['tokens'] {
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
    ): TokensAssetsStoreData['tokens'][number] | undefined {
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

}


let service: TokensAssetsService

export function useTokensAssets(): TokensAssetsService {
    if (service === undefined) {
        service = new TokensAssetsService(
            useEverWallet(),
            useEvmWallet(),
            new TokensListService(AlienTokenListURI),
            TokenAssetsURI,
        )
    }
    return service
}
