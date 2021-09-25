import { makeAutoObservable, reaction, runInAction } from 'mobx'

import { EthConstants } from '@/misc'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokenCache as TonTokenCache } from '@/stores/TonTokensCacheService'
import { TokensListService, TonToken } from '@/stores/TokensListService'
import { error } from '@/utils'


export type TokenAssetVault = {
    chainId: string;
    depositType: string;
    ethereumConfiguration: string;
    vault: string;
}

export type TokenAsset = {
    proxy: string;
    vaults: TokenAssetVault[];
}

export type TokenCache = {
    evm: {
        address: string;
        decimals: number;
    },
    vaults: TokenAssetVault[];
} & TonTokenCache

export type BridgeTokenAssetsManifest = {
    name: string;
    token: Record<string, TokenAsset>;
}

export type TokensCacheData = {
    assets: Record<string, TokenAsset>;
    tokens: TokenCache[];
}

export type TokensCacheState = {
    isFetchingAssets: boolean;
}


export class EvmTokensCacheService {

    protected data: TokensCacheData = {
        assets: {},
        tokens: [],
    }

    /**
     *
     * @protected
     */
    protected state: TokensCacheState = {
        isFetchingAssets: false,
    }

    constructor(
        protected readonly wallet: EvmWalletService,
        protected readonly tokensList: TokensListService<TonToken>,
    ) {
        makeAutoObservable(this)

        // When the Tokens List Service has loaded the list of
        // available tokens, we will start creating a token map
        reaction(
            () => [this.tokensList.time, this.wallet.address],
            async (
                [time, address],
                [prevTime, prevAddress],
            ) => {
                if (time !== prevTime || address !== prevAddress) {
                    await this.build()
                }
            },
            { delay: 100 },
        )

        this.fetchAssets(EthConstants.BridgeTokenAssetsURI).catch(reason => {
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

        this.data.tokens = this.tokensList.tokens.map(token => ({
            balance: undefined,
            decimals: token.decimals,
            evm: {
                address: '',
                decimals: token.decimals,
            },
            icon: token.logoURI,
            isUpdating: false,
            isUpdatingWalletAddress: false,
            name: token.name,
            root: token.address,
            symbol: token.symbol,
            updatedAt: -1,
            vaults: [],
            wallet: undefined,
        }))
    }

    /**
     * Returns tokens map where key is a token root address.
     * @protected
     */
    protected get _byRoot(): Record<string, TokensCacheData['tokens'][number]> {
        const entries: Record<string, TokensCacheData['tokens'][number]> = {}
        this.tokens.forEach(token => {
            entries[token.root] = token
        })
        return entries
    }

    /**
     * Returns Bridge token assets.
     * @returns {TokensCacheData['assets']}
     */
    public get assets(): TokensCacheData['assets'] {
        return this.data.assets
    }

    /**
     * Returns list of the cached tokens list.
     * @template T
     * @returns {TokensCacheData['tokens']}
     */
    public get tokens(): TokensCacheData['tokens'] {
        return this.data.tokens
    }

    /**
     * Returns filtered tokens by the given `chainId`
     * @param {string} chainId
     */
    public filterTokens(chainId: string): TokensCacheData['tokens'] {
        return this.data.tokens.map(token => {
            const asset = this.assets[token.root]
            return { ...token, vaults: asset.vaults }
        }).filter(token => {
            const asset = this.assets[token.root]
            return asset?.vaults.some(vault => vault.chainId === chainId) || false
        })
    }

    public findByVault(address: string, chainId: string): TokensCacheData['tokens'][number] | undefined {
        return this.filterTokens(chainId).find(
            ({ vaults }) => vaults.some(vault => vault.vault.toLowerCase() === address.toLowerCase()),
        )
    }

    /**
     * Returns token by the given token root address.
     * @param {string} root
     * @returns {TokensCacheData['tokens'][number] | undefined}
     */
    public get(root: string): TokensCacheData['tokens'][number] | undefined {
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
     * @param {TokensCacheData['tokens'][number]} token
     */
    public add(token: TokensCacheData['tokens'][number]): void {
        const tokens = this.tokens.slice()
        tokens.push(token)
        this.data.tokens = tokens
    }

    /**
     * Update token field by the given root address, key and value.
     * @param {string} root
     * @param {K extends keyof TokensCacheData['tokens'][number]} key
     * @param {TokensCacheData['tokens'][number][K]} value
     */
    public update<K extends keyof TokensCacheData['tokens'][number]>(
        root: string, key: K, value: TokensCacheData['tokens'][number][K],
    ): void {
        const token = this.get(root)
        if (token !== undefined) {
            token[key] = value
        }
    }

    public async fetchAssets(uri: string): Promise<void> {
        if (this.isFetchingAssets) {
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
            error('Cannot load bridge token assets list', reason)
            runInAction(() => {
                this.state.isFetchingAssets = false
            })
        })
    }

    public get isFetchingAssets(): TokensCacheState['isFetchingAssets'] {
        return this.state.isFetchingAssets
    }

}


const EvmTokensCacheServiceStore = new EvmTokensCacheService(
    useEvmWallet(),
    new TokensListService(EthConstants.TokenListURI),
)

export function useEvmTokensCache(): EvmTokensCacheService {
    return EvmTokensCacheServiceStore
}
