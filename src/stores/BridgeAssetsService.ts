import BigNumber from 'bignumber.js'
import { Address } from 'everscale-inpage-provider'
import { computed, makeObservable } from 'mobx'
import { PublicKey } from '@solana/web3.js'

import {
    AlienTokenListURI,
    BridgeAssetsURI,
    TokenAssetsURI,
    TokenListURI,
} from '@/config'
import {
    alienProxyContract,
    ethereumTokenTransferProxyContract,
    everscaleTokenTransferProxyContract,
    nativeProxyContract, solanaTokenTransferProxyContract,
} from '@/misc/contracts'
import { BridgeUtils, MergedTokenDetails } from '@/misc/BridgeUtils'
import { EverscaleToken, EvmToken, PipelineData } from '@/models'
import { BaseStore } from '@/stores/BaseStore'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { SolanaWalletService, useSolanaWallet } from '@/stores/SolanaWalletService'
import type { NetworkShape, TokenRaw, TokensListManifest } from '@/types'
import {
    debug,
    error,
    findNetwork,
    getEverscaleMainNetwork,
    isEverscaleAddressValid,
    isEvmAddressValid,
    isGoodBignumber, isSolanaAddressValid,
    resolveEverscaleAddress,
    sliceAddress,
    storage,
} from '@/utils'
import { SolanaToken } from '@/models/SolanaToken'


export type BridgeTokenRawAssetVault = {
    chainId: string;
    depositType: string;
    ethereumConfiguration?: string;
    everscaleConfiguration?: string;
    name?: string;
    settings?: string;
    solanaConfiguration?: string;
    token?: string;
    vault: string;
}

export type BridgeTokenRawAsset = {
    proxy: string;
    vaults: BridgeTokenRawAssetVault[];
}

export type BridgeTokenRawAssets = {
    [direction: string]: BridgeTokenRawAsset;
}

export type BridgeTokensRawAssets = {
    [tokenRoot: string]: BridgeTokenRawAssets;
}

export type BridgeAssetsManifest = {
    name: string;
    multitoken: BridgeTokenRawAssets;
    token: BridgeTokensRawAssets;
}

export type BridgeAssetsServiceCtorWallets = {
    everWallet?: EverWalletService;
    evmWallet?: EvmWalletService;
    solanaWallet?: SolanaWalletService;
}

export type BridgeAssetsServiceCtorOptions = {
    alienTokensLists?: string[];
    assetsUri: string;
    primaryTokensList: string;
}

export type BridgeAssetUniqueKey = { key: string; }

export type BridgeAsset =
    EverscaleToken<BridgeAssetUniqueKey>
    | EvmToken<BridgeAssetUniqueKey>
    | SolanaToken<BridgeAssetUniqueKey>

export type ImportedBridgeAsset = BridgeAssetUniqueKey & {
    chainId: string;
    decimals: number;
    icon: string;
    logoURl: string;
    name: string;
    root: string;
    symbol: string;
}

export type BridgeAssetsServiceData = {
    assets: BridgeTokensRawAssets;
    multiAssets: BridgeTokenRawAssets;
    rawAlienTokens: TokenRaw<string>[];
    rawPrimaryTokens: TokenRaw<string>[];
    tokens: BridgeAsset[];
}

export type BridgeAssetsServiceState = {
    isAlienTokensFetched: boolean;
    isAssetsFetched: boolean;
    isBuilt: boolean;
    isFetching: boolean;
    isPrimaryTokensFetched: boolean;
}


export class BridgeAssetsService extends BaseStore<BridgeAssetsServiceData, BridgeAssetsServiceState> {

    constructor(
        protected readonly wallets: BridgeAssetsServiceCtorWallets,
        protected readonly options: BridgeAssetsServiceCtorOptions,
    ) {
        super()

        this.setData(() => ({
            assets: {},
            multiAssets: {},
            rawAlienTokens: [],
            rawPrimaryTokens: [],
            tokens: [],
        }))

        this.setState(() => ({
            isAlienTokensFetched: false,
            isAssetsFetched: false,
            isBuilt: false,
            isFetching: false,
            isPrimaryTokensFetched: false,
        }))

        makeObservable<BridgeAssetsService, '_byKey'>(this, {
            _byKey: computed,
            assets: computed,
            isFetching: computed,
            isReady: computed,
            tokens: computed,
        });

        (async () => {
            await this.init()
        })()
    }

    /**
     *
     */
    public async init(): Promise<void> {
        const { alienTokensLists, assetsUri, primaryTokensList } = this.options

        this.setState({
            isBuilt: false,
            isFetching: true,
        })

        try {
            const [
                assets,
                primaryTokensManifest,
            ]: [a: BridgeAssetsManifest, p: TokensListManifest] = await Promise.all([
                fetch(assetsUri, { method: 'GET' }).then(
                    value => value.json(),
                ),
                fetch(primaryTokensList, { method: 'GET' }).then(
                    value => value.json(),
                ),
            ])

            this.setData({
                assets: assets.token,
                multiAssets: assets.multitoken,
                rawPrimaryTokens: primaryTokensManifest.tokens,
            })

            this.setState({
                isAssetsFetched: (
                    Object.keys(assets.token).length > 0
                    && 'multitoken' in assets ? Object.keys(assets.multitoken).length > 0 : true
                ),
                isPrimaryTokensFetched: primaryTokensManifest.tokens.length > 0,
            })
        }
        catch (e) {
            error('Primary tokens manifest or Bridge assets fetch error', e)
            this.setState('isFetching', false)
            return
        }

        try {
            const alienTokensManifests = await Promise.allSettled<TokensListManifest>(
                alienTokensLists?.map(async listUri => fetch(listUri, { method: 'GET' }).then(
                    value => value.json(),
                )) ?? [],
            ).then(response => response.map(
                r => (r.status === 'fulfilled' ? r.value : undefined),
            ))

            this.setData(
                'rawAlienTokens',
                (alienTokensManifests.filter(Boolean) as TokensListManifest[])
                    .map(list => list?.tokens)
                    .flatMap(tokens => tokens),
            )

        }
        catch (e) {
            debug('Alien tokens manifests fetch error', e)
        }
        finally {
            this.setState({
                isAlienTokensFetched: true,
                isFetching: false,
            })
        }

        await this.build()
    }

    /**
     *
     * @protected
     */
    protected async build(): Promise<void> {
        this.setData('tokens', this.data.rawPrimaryTokens.map(token => new EverscaleToken({
            ...token,
            address: resolveEverscaleAddress(token.address),
            chainId: token.chainId?.toString(),
            key: `everscale-${token.chainId}-${token.address}`.toLowerCase(),
            root: token.address,
        })))

        const exists = new Set<string>()

        Object.entries(this.assets).forEach(([tokenRoot, pipelines]) => {
            const cachedToken = this.get('everscale', '1', tokenRoot.toLowerCase())
            if (cachedToken !== undefined) {
                Object.entries(pipelines).forEach(([direction, pipeline]) => {
                    const [tokenBase, target] = direction.split('_')
                    const prefix = tokenBase === 'everscale' ? target : tokenBase
                    if (prefix === 'evm') {
                        pipeline.vaults.forEach(vault => {
                            const key = `evm-${vault.chainId}-${vault.token}`.toLowerCase()
                            if (!exists.has(key) && vault.token !== undefined) {
                                this.add(new EvmToken<BridgeAssetUniqueKey>({
                                    address: vault.token,
                                    chainId: vault.chainId.toString(),
                                    decimals: cachedToken.decimals,
                                    key,
                                    logoURI: cachedToken.icon,
                                    name: cachedToken.name,
                                    root: vault.token,
                                    symbol: cachedToken.symbol,
                                }))

                                exists.add(key)
                            }
                        })
                    }
                    else if (prefix === 'solana') {
                        pipeline.vaults.forEach(vault => {
                            const key = `solana-${vault.chainId}-${vault.token}`.toLowerCase()
                            if (!exists.has(key) && vault.token !== undefined) {
                                this.add(new SolanaToken<BridgeAssetUniqueKey>({
                                    address: new PublicKey(vault.token),
                                    chainId: vault.chainId.toString(),
                                    decimals: cachedToken.decimals,
                                    key,
                                    logoURI: cachedToken.icon,
                                    name: cachedToken.name,
                                    root: vault.token,
                                    symbol: cachedToken.symbol,
                                }))

                                exists.add(key)
                            }
                        })
                    }
                })
            }
        })

        const alienTokens: BridgeAssetsServiceData['tokens'] = this.tokens.slice()

        this.data.rawAlienTokens?.forEach(token => {
            if (isEvmAddressValid(token.address)) {
                const key = `evm-${token.chainId}-${token.address}`.toLowerCase()
                if (!exists.has(key)) {
                    alienTokens.push(new EvmToken<BridgeAssetUniqueKey>({
                        address: token.address,
                        chainId: token.chainId?.toString(),
                        decimals: token.decimals,
                        key,
                        logoURI: token.logoURI,
                        name: token.name,
                        root: token.address,
                        symbol: token.symbol,
                    }))

                    exists.add(key)
                }
            }
            else if (isSolanaAddressValid(token.address)) {
                const key = `solana-${token.chainId ?? 1}-${token.address}`.toLowerCase()
                if (!exists.has(key)) {
                    alienTokens.push(new SolanaToken<BridgeAssetUniqueKey>({
                        address: new PublicKey(token.address),
                        chainId: token.chainId?.toString(),
                        decimals: token.decimals,
                        key,
                        logoURI: token.logoURI,
                        name: token.name,
                        root: token.address,
                        symbol: token.symbol,
                    }))

                    exists.add(key)
                }
            }
        })

        this.setData('tokens', alienTokens)

        if (this.tokens.length > 0) {
            setTimeout(() => {
                try {
                    const importedTokens = JSON.parse(storage.get('imported_assets') || '{}')

                    Object.entries<ImportedBridgeAsset>({ ...importedTokens })
                        .forEach(([key, { icon, ...token }]) => {
                            if (!this.has(key)) {
                                if (isEverscaleAddressValid(token.root)) {
                                    this.add(new EverscaleToken<BridgeAssetUniqueKey>({
                                        ...token,
                                        address: new Address(token.root),
                                        key,
                                        logoURI: icon || token.logoURl,
                                    }))
                                }
                                else if (isEvmAddressValid(token.root)) {
                                    this.add(new EvmToken<BridgeAssetUniqueKey>({
                                        ...token,
                                        key,
                                        logoURI: icon || token.logoURl,
                                    }))
                                }
                                else if (isSolanaAddressValid(token.root)) {
                                    this.add(new SolanaToken({
                                        ...token,
                                        address: new PublicKey(token.root),
                                        key,
                                        logoURI: icon || token.logoURl,
                                    }))
                                }
                            }
                        })
                }
                catch (e) {

                }
            }, 10)
        }

        this.setState('isBuilt', true)
    }

    /**
     *
     */
    public get isFetching(): BridgeAssetsServiceState['isFetching'] {
        return this.state.isFetching
    }

    /**
     *
     */
    public get assets(): BridgeAssetsServiceData['assets'] {
        return this.data.assets
    }

    /**
     *
     */
    public get multiAssets(): BridgeAssetsServiceData['multiAssets'] {
        return this.data.multiAssets
    }

    /**
     *
     */
    public get tokens(): BridgeAssetsServiceData['tokens'] {
        return this.data.tokens
    }

    /**
     * Returns filtered tokens by the given `chainId`
     * @param {string} chainId
     */
    public filterTokensByChain(chainId: string): BridgeAssetsServiceData['tokens'] {
        return this.tokens.filter(
            token => token.chainId === chainId || this.findAssetRootByTokenAndChain(token.root, chainId),
        )
    }

    /**
     * Returns token by the given vault `address` and `chainId`
     * @param {string} address
     * @param {string} chainId
     */
    public findTokenByVaultAndChain(address: string, chainId: string): BridgeAssetsServiceData['tokens'][number] | undefined {
        return this.tokens.find(
            token => token.root.toLowerCase() === this.findAssetRootByVaultAndChain(address, chainId)?.toLowerCase(),
        )
    }

    /**
     * Returns token root from bridge assets by the given Evm token `root` and network `chainId`
     * @param {string} address
     * @param {string} chainId
     */
    public findAssetRootByVaultAndChain(address: string, chainId: string): string | undefined {
        let assetRoot: string | undefined
        Object.entries(this.assets).some(
            ([tokenRoot, pipelines]) => Object.values(pipelines).some(
                pipeline => pipeline.vaults.some(vault => {
                    if (vault.vault.toLowerCase() === address.toLowerCase() && vault.chainId === chainId) {
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
     * Returns token root from bridge assets by the given Evm token `root` and network `chainId`
     * @param {string} root
     * @param {string} chainId
     */
    public findAssetRootByTokenAndChain(root: string, chainId: string): string | undefined {
        let assetRoot: string | undefined
        Object.entries(this.assets).some(
            ([tokenRoot, pipelines]) => Object.values(pipelines).some(
                pipeline => pipeline.vaults.some(vault => {
                    if (vault.token?.toLowerCase() === root.toLowerCase() && vault.chainId === chainId) {
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
     * Returns token by the given `networkType`, `chainId` and token `root` address.
     * @param {string} networkType
     * @param {string} chainId
     * @param {string} root
     * @returns {BridgeAsset}
     */
    public get(networkType: string, chainId: string, root: string): BridgeAssetsServiceData['tokens'][number] | undefined {
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
     * @param {BridgeAsset} token
     */
    public add(token: BridgeAsset): void {
        if (this.has(token.get('key'))) {
            this.setData('tokens', this.tokens.map(item => {
                if (item.get('key').toLowerCase() === token.get('key')?.toLowerCase()) {
                    if (isEverscaleAddressValid(token.root)) {
                        return (item as EverscaleToken<BridgeAssetUniqueKey>)
                            .setData((token as EverscaleToken).toJSON())
                    }
                    if (isEvmAddressValid(token.root)) {
                        return (item as EvmToken<BridgeAssetUniqueKey>)
                            .setData((token as EvmToken).toJSON())
                    }
                    if (isSolanaAddressValid(token.root)) {
                        return (item as SolanaToken<BridgeAssetUniqueKey>)
                            .setData((token as SolanaToken).toJSON())
                    }
                }
                return item
            }))
        }
        else {
            const tokens = this.tokens.slice()
            // @ts-ignore
            token.setData('root', token.root)
            tokens.push(token)
            this.setData('tokens', tokens)
        }
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
    ): Promise<PipelineData | undefined> {
        const [fromNetworkType, fromChainId] = from.split('-')
        const [toNetworkType, toChainId] = to.split('-')
        const isFromEverscaleToEvm = fromNetworkType === 'everscale' && toNetworkType === 'evm'
        const isFromEvmToEverscale = fromNetworkType === 'evm' && toNetworkType === 'everscale'
        const isFromEverscaleToSolana = fromNetworkType === 'everscale' && toNetworkType === 'solana'
        const isFromSolanaToEverscale = fromNetworkType === 'solana' && toNetworkType === 'everscale'

        const isEverscaleToken = isEverscaleAddressValid(root)
        const isEvmToken = isEvmAddressValid(root)

        if (isEverscaleToken) {
            if (this.wallets.everWallet?.account?.address !== undefined) {
                try {
                    const token = this.get('everscale', fromChainId, root.toLowerCase());
                    (token as EverscaleToken)?.setData('balance', undefined)
                    await (token as EverscaleToken)?.sync(this.wallets.everWallet.account.address, true)
                }
                catch (e) {
                    error(e)
                }
            }
        }

        let network: NetworkShape | undefined,
            pipeline = await this.resolvePipeline(root, from, to, depositType)

        if (pipeline === undefined) {
            pipeline = await this.resolveMultiPipeline(root.toLowerCase(), from, to, depositType)
        }

        if (isFromEverscaleToEvm) {
            network = findNetwork(toChainId, 'evm')
        }
        else if (isFromEvmToEverscale) {
            network = findNetwork(fromChainId, 'evm')
        }
        else if (isFromEverscaleToSolana) {
            network = findNetwork(toChainId, 'solana')
        }
        else if (isFromSolanaToEverscale) {
            network = findNetwork(fromChainId, 'solana')
        }

        // Fetch everscale configuration
        if (pipeline?.isMultiVault) {
            if (network?.rpcUrl !== undefined && pipeline?.evmTokenAddress !== undefined) {
                debug('> Fetch other pipeline meta data')

                const meta = await BridgeUtils.getEvmMultiVaultTokenMeta(
                    pipeline.vaultAddress.toString(),
                    pipeline.evmTokenAddress,
                    network.rpcUrl,
                )

                pipeline.depositFee = meta.depositFee
                pipeline.isBlacklisted = meta.blacklisted
                pipeline.withdrawFee = meta.withdrawFee

                // if equal 0
                if (!isGoodBignumber(meta.activation)) {
                    if (pipeline.tokenBase === 'evm') {
                        debug('> Fetch EVM fees data')
                        try {
                            const fees = await BridgeUtils.getEvmMultiVaultAlienFees(
                                pipeline.vaultAddress.toString(),
                                network.rpcUrl,
                            )
                            pipeline.depositFee = fees.depositFee
                            pipeline.withdrawFee = fees.withdrawFee
                        }
                        catch (e) {
                            debug('> Fetch alien fees error', e)
                        }

                    }
                    else if (pipeline.tokenBase === 'everscale') {
                        debug('> Fetch EVM fees data')
                        try {
                            const fees = await BridgeUtils.getEvmMultiVaultNativeFees(
                                pipeline.vaultAddress.toString(),
                                network.rpcUrl,
                            )
                            pipeline.depositFee = fees.depositFee
                            pipeline.withdrawFee = fees.withdrawFee
                        }
                        catch (e) {
                            debug('Fetch native fees error', e)
                        }
                    }
                }
            }

            pipeline.everscaleConfiguration = pipeline.isNative
                ? (await nativeProxyContract(pipeline.proxyAddress)
                    .methods.getConfiguration({ answerId: 0 })
                    .call())
                    .value0
                    .everscaleConfiguration
                : (await alienProxyContract(pipeline.proxyAddress)
                    .methods.getConfiguration({ answerId: 0 })
                    .call())
                    .value0
                    .everscaleConfiguration
        }
        else if (pipeline?.tokenBase === 'everscale') {
            pipeline.everscaleConfiguration = (await everscaleTokenTransferProxyContract(pipeline.proxyAddress)
                .methods.getDetails({ answerId: 0 })
                .call())
                ._config
                .tonConfiguration
        }
        else if (pipeline?.tokenBase === 'evm') {
            pipeline.everscaleConfiguration = (await ethereumTokenTransferProxyContract(pipeline.proxyAddress)
                .methods.getDetails({ answerId: 0 })
                .call())
                .value0
                .tonConfiguration
        }
        else if (pipeline?.tokenBase === 'solana') {
            const { value0 } = await solanaTokenTransferProxyContract(pipeline.proxyAddress)
                .methods.getDetails({ answerId: 0 })
                .call()

            if (isFromSolanaToEverscale) {
                pipeline.everscaleConfiguration = value0.solanaEverscaleConfiguration
            }
            else if (isFromEverscaleToSolana) {
                pipeline.everscaleConfiguration = value0.everscaleSolanaConfiguration
            }
        }

        if (network?.rpcUrl !== undefined && pipeline?.solanaTokenAddress !== undefined) {
            try {
                pipeline.solanaTokenDecimals = await BridgeUtils.getSolanaTokenDecimals(
                    pipeline.solanaTokenAddress,
                    network.rpcUrl,
                )
            }
            catch (e) {
                error(e)
            }
        }

        if (
            this.wallets.solanaWallet?.publicKey != null
            && this.wallets.solanaWallet?.connection != null
            && pipeline?.solanaTokenAddress !== undefined
        ) {
            try {
                pipeline.solanaTokenBalance = (await this.wallets.solanaWallet.connection.getParsedTokenAccountsByOwner(
                    this.wallets.solanaWallet.publicKey,
                    { mint: pipeline.solanaTokenAddress },
                )).value.pop()?.account.data.parsed.info.tokenAmount.amount || 0
            }
            catch (e) {
                error(e)
            }
        }

        if (pipeline?.evmTokenAddress !== undefined && network?.rpcUrl !== undefined) {
            try {
                pipeline.evmTokenDecimals = await BridgeUtils.getEvmTokenDecimals(
                    pipeline.evmTokenAddress,
                    network.rpcUrl,
                )
            }
            catch (e) {
                error(e)
            }

            if (isEvmToken && this.wallets.evmWallet?.address !== undefined) {
                try {
                    pipeline.evmTokenBalance = await BridgeUtils.getEvmTokenBalance(
                        pipeline.evmTokenAddress,
                        this.wallets.evmWallet.address,
                        network.rpcUrl,
                    )
                }
                catch (e) {
                    error(e)
                }
            }
        }

        if (pipeline?.vaultAddress !== undefined && network?.rpcUrl !== undefined) {
            // Fetch vault details for non-everscale-based token
            if (pipeline.evmTokenAddress !== undefined && pipeline.isMerged) {
                try {
                    pipeline.vaultBalance = await BridgeUtils.getEvmTokenBalance(
                        pipeline.evmTokenAddress,
                        pipeline.vaultAddress.toString(),
                        network.rpcUrl,
                    )
                }
                catch (e) {
                    error(e)
                }
            }

            if (
                pipeline?.vaultAddress instanceof PublicKey
                && isSolanaAddressValid(pipeline?.vaultAddress.toBase58())
                && this.wallets.solanaWallet?.connection != null
            ) {
                try {
                    const tokenAmount = (await this.wallets.solanaWallet.connection.getTokenAccountBalance(
                        pipeline.vaultAddress,
                    )).value
                    pipeline.vaultBalance = tokenAmount.amount
                    pipeline.solanaTokenDecimals = pipeline.solanaTokenDecimals ?? tokenAmount.decimals
                }
                catch (e) {
                    //
                }
            }
        }

        debug('> Suggested pipeline ', pipeline)

        return pipeline
    }

    protected async resolvePipeline(
        root: string,
        from: string,
        to: string,
        depositType: string = 'default',
    ): Promise<PipelineData | undefined> {
        const [fromNetworkType, fromChainId] = from.split('-')
        const [toNetworkType, toChainId] = to.split('-')

        const everscaleMainnet = getEverscaleMainNetwork()
        const everscaleMainnetId = `${everscaleMainnet?.type}-${everscaleMainnet?.chainId}`
        const isFromEverscale = fromNetworkType === 'everscale'
        const isFromEvm = fromNetworkType === 'evm'
        const isFromEverscaleToEvm = fromNetworkType === 'everscale' && toNetworkType === 'evm'
        const isFromEvmToEverscale = fromNetworkType === 'evm' && toNetworkType === 'everscale'
        const isFromEverscaleToSolana = fromNetworkType === 'everscale' && toNetworkType === 'solana'
        const isFromSolanaToEverscale = fromNetworkType === 'solana' && toNetworkType === 'everscale'

        const isEverscaleToken = isEverscaleAddressValid(root)
        const isEvmToken = isEvmAddressValid(root)
        const isSolanaToken = isSolanaAddressValid(root)

        const pipelines: PipelineData[] = []
        let assetRoot: string = root.toLowerCase()

        if (isEvmToken && isFromEverscale) {
            assetRoot = (this.findAssetRootByTokenAndChain(root, toChainId) ?? root).toLowerCase()
        }
        else if (isEvmToken && isFromEvm) {
            assetRoot = (this.findAssetRootByTokenAndChain(root, fromChainId) ?? root).toLowerCase()
        }
        else if (isSolanaToken && isFromEverscaleToSolana) {
            assetRoot = (this.findAssetRootByTokenAndChain(root, toChainId) ?? root).toLowerCase()
        }
        else if (isSolanaToken && isFromSolanaToEverscale) {
            assetRoot = (this.findAssetRootByTokenAndChain(root, fromChainId) ?? root).toLowerCase()
        }

        const bridgeAssets = this.assets[assetRoot]

        Object.entries({ ...bridgeAssets }).forEach(([key, { proxy, vaults }]) => {
            const [tokenBase, assetTo] = key.split('_')
            vaults.forEach(vault => {
                const chainId = vault.chainId ?? '1'
                const firstFrom = tokenBase === everscaleMainnet?.type ? everscaleMainnetId : `${tokenBase}-${chainId}`
                const firstTo = assetTo === everscaleMainnet?.type ? everscaleMainnetId : `${assetTo}-${chainId}`
                const secondFrom = assetTo === everscaleMainnet?.type ? everscaleMainnetId : `${assetTo}-${chainId}`
                const secondTo = tokenBase === everscaleMainnet?.type ? everscaleMainnetId : `${tokenBase}-${chainId}`

                const pipeline: PipelineData = {
                    chainId,
                    depositType: vault.depositType,
                    ethereumConfiguration: vault.ethereumConfiguration
                        ? new Address(vault.ethereumConfiguration)
                        : undefined,
                    everscaleConfiguration: vault.everscaleConfiguration
                        ? new Address(vault.everscaleConfiguration)
                        : undefined,
                    everscaleTokenAddress: new Address(isEverscaleToken ? root : assetRoot),
                    evmTokenAddress: isEvmToken ? root : undefined,
                    evmTokenDecimals: undefined,
                    from, // would be overriding below
                    isMultiVault: false,
                    isNative: tokenBase === 'everscale',
                    name: vault.name,
                    proxyAddress: new Address(proxy),
                    settings: vault.settings ? new PublicKey(vault.settings) : undefined,
                    solanaConfiguration: vault.solanaConfiguration
                        ? new Address(vault.solanaConfiguration)
                        : undefined,
                    solanaTokenAddress: tokenBase === 'solana' && vault.token ? new PublicKey(vault.token) : undefined,
                    to, // would be overriding below
                    tokenBase,
                    vaultAddress: isSolanaAddressValid(vault.vault) ? new PublicKey(vault.vault) : vault.vault,
                }

                pipelines.push({
                    ...pipeline,
                    from: firstFrom,
                    to: firstTo,
                }, {
                    ...pipeline,
                    from: secondFrom,
                    to: secondTo,
                })
            })
        })

        const pipeline = pipelines.find(
            asset => asset.from === from
            && asset.to === to
            && asset.depositType === depositType,
        )

        if (isFromEverscaleToSolana || isFromSolanaToEverscale) {
            return pipeline
        }

        let network: NetworkShape | undefined

        if (isFromEverscaleToEvm) {
            network = findNetwork(toChainId, 'evm')
        }
        else if (isFromEvmToEverscale) {
            network = findNetwork(fromChainId, 'evm')
        }

        if (pipeline?.vaultAddress !== undefined && network?.rpcUrl !== undefined) {
            if (isEverscaleToken) {
                try {
                    const evmTokenAddress = await BridgeUtils.getEvmVaultTokenAddress(
                        pipeline.vaultAddress.toString(),
                        network.rpcUrl,
                    )
                    pipeline.evmTokenAddress = evmTokenAddress.toLowerCase()
                }
                catch (e) {
                    return undefined
                }
            }

            // Fetch vault details for non-everscale-based token
            if (pipeline.evmTokenAddress !== undefined && pipeline.tokenBase !== 'everscale') {
                try {
                    const [vaultBalance, vaultLimit] = await Promise.all([
                        BridgeUtils.getEvmTokenBalance(
                            pipeline.evmTokenAddress,
                            pipeline.vaultAddress.toString(),
                            network.rpcUrl,
                        ),
                        BridgeUtils.getEvmVaultAvailableDepositLimit(
                            pipeline.vaultAddress.toString(),
                            network.rpcUrl,
                        ),
                    ])
                    pipeline.vaultBalance = vaultBalance
                    pipeline.vaultLimit = vaultLimit
                }
                catch (e) {
                    error(e)
                }
            }
        }

        return pipeline
    }

    protected async resolveMultiPipeline(
        root: string,
        from: string,
        to: string,
        depositType: string = 'default',
    ): Promise<PipelineData | undefined> {
        const [fromNetworkType, fromChainId] = from.split('-')
        const [toNetworkType, toChainId] = to.split('-')
        const isFromEverscale = fromNetworkType === 'everscale'
        const isFromEvm = fromNetworkType === 'evm'
        const isEverscaleToken = isEverscaleAddressValid(root)
        const isEvmToken = isEvmAddressValid(root)

        let network: NetworkShape | undefined,
            pipeline: PipelineData | undefined

        if (isFromEverscale) {
            network = findNetwork(toChainId, 'evm')
            debug('> Choose right network as EVM network:', network?.label)
        }
        else if (isFromEvm) {
            network = findNetwork(fromChainId, 'evm')
            debug('> Choose left network as EVM network:', network?.label)
        }

        if (isEverscaleToken) {
            pipeline = {
                everscaleTokenAddress: new Address(root),
                from,
                isMultiVault: true,
                to,
            } as PipelineData

            let alien = false,
                merge: MergedTokenDetails | undefined

            try {
                debug('> Try to fetch token meta by alien token root contract')

                const meta = await BridgeUtils.getAlienTokenRootMeta(root)

                pipeline = {
                    ...pipeline,
                    baseChainId: meta.base_chainId,
                    evmTokenAddress: meta.base_chainId === toChainId
                        ? `0x${new BigNumber(meta.base_token).toString(16).padStart(40, '0')}`.toLowerCase()
                        : undefined,
                    evmTokenDecimals: meta.base_chainId === toChainId ? parseInt(meta.decimals, 10) : undefined,
                    isNative: meta.base_chainId !== toChainId,
                }

                alien = meta.base_chainId === toChainId

                debug('> Token meta by alien token root contract fetched')
                debug(`> Token is ${pipeline.isNative ? 'native' : 'alien'} for ${fromNetworkType} (chainId: ${fromChainId}) and ${pipeline.isNative ? 'alien' : 'native'} for ${toNetworkType} (chainId: ${toChainId})`)
            }
            catch (e: any) {
                debug('> Fetch token meta error', e.message)
                debug(`> Token is native for ${fromNetworkType} (chainId: ${fromChainId}) and alien for ${toNetworkType} (${toChainId})`)
            }

            if (!alien) {
                try {
                    const asset = this.multiAssets[`${toNetworkType}_${fromNetworkType}`]
                    if (asset !== undefined) {
                        debug('> Checking merged token')

                        merge = await BridgeUtils.getMergedTokenDetails(
                            root,
                            asset.proxy,
                            toChainId,
                        )
                        alien = merge !== undefined

                        debug('> Check merged token success', merge)
                    }
                }
                catch (e: any) {
                    debug('> Check merged token error', e.message)
                }
            }

            if (alien) {
                const asset = this.multiAssets[`${toNetworkType}_${fromNetworkType}`]

                if (asset !== undefined) {
                    const assetVault = asset.vaults.find(
                        item => item.chainId === toChainId && item.depositType === depositType,
                    )

                    if (assetVault !== undefined) {
                        pipeline = {
                            ...pipeline,
                            ...merge,
                            chainId: assetVault.chainId,
                            depositType: assetVault.depositType,
                            ethereumConfiguration: assetVault.ethereumConfiguration
                                ? new Address(assetVault.ethereumConfiguration.toLowerCase())
                                : undefined,
                            isNative: false,
                            proxyAddress: new Address(asset.proxy.toLowerCase()),
                            tokenBase: 'evm',
                            vaultAddress: assetVault.vault.toLowerCase(),
                        }

                        debug('> Define pipeline for alien token', pipeline)

                        if (merge?.mergeEvmTokenAddress !== undefined) {
                            pipeline.evmTokenAddress = merge.mergeEvmTokenAddress
                        }

                        if (merge?.canonicalTokenAddress) {
                            pipeline.everscaleTokenAddress = merge.canonicalTokenAddress
                        }

                        return pipeline
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
                        pipeline = {
                            ...pipeline,
                            chainId: assetVault.chainId,
                            depositType: assetVault.depositType,
                            ethereumConfiguration: assetVault.ethereumConfiguration
                                ? new Address(assetVault.ethereumConfiguration.toLowerCase())
                                : undefined,
                            isNative: true,
                            proxyAddress: new Address(asset.proxy.toLowerCase()),
                            tokenBase: 'everscale',
                            vaultAddress: assetVault.vault.toString(),
                        }

                        if (network?.rpcUrl !== undefined) {
                            try {
                                debug('> Fetch EVM token address via MultiVault')

                                pipeline.evmTokenAddress = (await BridgeUtils.getEvmMultiVaultNativeToken(
                                    pipeline.vaultAddress.toString(),
                                    root,
                                    network.rpcUrl,
                                )).toLowerCase()

                                debug('> EVM token address fetched by MultiVault => ', sliceAddress(pipeline.evmTokenAddress))
                            }
                            catch (e) {
                                error('> EVM token address fetched by MultiVault with error', e)
                                return undefined
                            }
                        }

                        debug('> Define pipeline for alien token', pipeline)

                        return pipeline
                    }
                }
            }
        }
        else if (isEvmToken) {
            const asset = this.multiAssets[`${fromNetworkType}_${toNetworkType}`]
            const assetVault = asset.vaults.find(
                item => item.chainId === fromChainId && item.depositType === depositType,
            )

            pipeline = {
                evmTokenAddress: root,
                from,
                isMultiVault: true,
                proxyAddress: new Address(asset.proxy.toString()),
                to,
            } as PipelineData

            if (assetVault !== undefined) {
                pipeline = {
                    ...pipeline,
                    chainId: assetVault.chainId,
                    depositType: assetVault.depositType,
                    ethereumConfiguration: assetVault.ethereumConfiguration
                        ? new Address(assetVault.ethereumConfiguration.toLowerCase())
                        : undefined,
                    vaultAddress: assetVault.vault.toLowerCase(),
                }

                if (pipeline.evmTokenAddress !== undefined && network?.rpcUrl !== undefined) {
                    const meta = await BridgeUtils.getEvmMultiVaultTokenMeta(
                        pipeline.vaultAddress.toString(),
                        pipeline.evmTokenAddress,
                        network.rpcUrl,
                    )

                    if (meta.isNative) {
                        const oppositeAsset = this.multiAssets[`${toNetworkType}_${fromNetworkType}`]
                        const oppositeVault = oppositeAsset.vaults.find(
                            item => item.chainId === fromChainId
                            && item.depositType === depositType,
                        )

                        if (oppositeVault !== undefined) {
                            pipeline = {
                                ...pipeline,
                                chainId: oppositeVault.chainId,
                                depositType: oppositeVault.depositType,
                                ethereumConfiguration: oppositeVault.ethereumConfiguration
                                    ? new Address(oppositeVault.ethereumConfiguration.toLowerCase())
                                    : undefined,
                                isNative: true,
                                proxyAddress: new Address(oppositeAsset.proxy.toLowerCase()),
                                tokenBase: 'everscale',
                                vaultAddress: oppositeVault.vault.toLowerCase(),
                            }

                            try {
                                const everscaleTokenAddress = (await BridgeUtils.getEvmMultiVaultExternalNativeToken(
                                    assetVault.vault,
                                    root,
                                    network.rpcUrl,
                                ))?.toLowerCase()

                                if (everscaleTokenAddress !== undefined) {
                                    pipeline.everscaleTokenAddress = new Address(everscaleTokenAddress)
                                }
                            }
                            catch (e) {
                                error(e)
                                return undefined
                            }

                            return pipeline
                        }
                    }
                    else {
                        pipeline = {
                            ...pipeline,
                            isNative: false,
                            tokenBase: 'evm',
                        }

                        const token = this.get('evm', pipeline.chainId, root)

                        if (token?.decimals !== undefined && token.name !== undefined) {
                            try {
                                const everscaleTokenAddress = (await BridgeUtils.getDeriveAlienTokenRoot(
                                    pipeline.proxyAddress,
                                    {
                                        chainId: (token as EvmToken)?.get('chainId') as string,
                                        decimals: token.decimals.toString(),
                                        name: token?.name,
                                        symbol: token?.symbol,
                                        token: root,
                                    },
                                )).toLowerCase()

                                pipeline.everscaleTokenAddress = new Address(everscaleTokenAddress)
                            }
                            catch (e) {
                                error(e)
                                return undefined
                            }


                            if (pipeline.everscaleTokenAddress !== undefined) {
                                const canonicalTokenAddress = await BridgeUtils.getCanonicalToken(
                                    pipeline.everscaleTokenAddress,
                                    pipeline.proxyAddress,
                                )
                                if (canonicalTokenAddress !== undefined) {
                                    pipeline.canonicalTokenAddress = canonicalTokenAddress
                                    pipeline.everscaleTokenAddress = canonicalTokenAddress
                                }
                            }

                            return pipeline
                        }
                    }
                }
            }
        }

        return pipeline
    }

    /**
     *
     * @param root
     * @param chainId
     */
    public isCreditAvailable(root: string, chainId: string): boolean {
        const assetRoot = this.findAssetRootByTokenAndChain(root, chainId)
        if (assetRoot === undefined) {
            return false
        }
        const assets = this.assets[assetRoot]
        return Object.values({ ...assets }).some(
            asset => asset.vaults.some(vault => vault.depositType === 'credit'),
        )
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
     *
     */
    public get isReady(): boolean {
        return (
            this.state.isBuilt
            && this.state.isPrimaryTokensFetched
            && this.state.isAssetsFetched
            && this.state.isAlienTokensFetched
        )
    }

    /**
     * Returns tokens map where key is a token root address.
     * @protected
     */
    protected get _byKey(): Record<string, BridgeAssetsServiceData['tokens'][number]> {
        const map: Record<string, BridgeAssetsServiceData['tokens'][number]> = {}
        this.tokens.forEach(token => {
            map[token.get('key')] = token
        })
        return map
    }

}


let service: BridgeAssetsService

export function useBridgeAssets(): BridgeAssetsService {
    if (service === undefined) {
        service = new BridgeAssetsService({
            everWallet: useEverWallet(),
            evmWallet: useEvmWallet(),
            solanaWallet: useSolanaWallet(),
        }, {
            alienTokensLists: [
                BridgeAssetsURI,
                AlienTokenListURI,
            ],
            assetsUri: TokenAssetsURI,
            primaryTokensList: TokenListURI,
        })
    }

    return service
}
