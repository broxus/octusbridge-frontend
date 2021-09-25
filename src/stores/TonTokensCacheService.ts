import { Mutex } from '@broxus/await-semaphore'
import { makeAutoObservable, reaction } from 'mobx'
import ton, { Address, Subscription } from 'ton-inpage-provider'

import { TokenWallet, TonConstants } from '@/misc'
import { TokensListService, TonToken } from '@/stores/TokensListService'
import { Account, CrystalWalletService, useCrystalWallet } from '@/stores/CrystalWalletService'
import { debug, error } from '@/utils'


export type TokenCache = {
    balance?: string;
    decimals: number;
    icon?: string;
    isUpdating: boolean;
    isUpdatingWalletAddress: boolean;
    name: string;
    root: string;
    symbol: string;
    updatedAt: number;
    wallet?: string;
}

type TokensCacheData = {
    tokens: TokenCache[];
}


export class TonTokensCacheService {

    /**
     * Current data of the tokens cache
     * @type {TokensCacheData}
     * @protected
     */
    protected data: TokensCacheData = {
        tokens: [],
    }

    constructor(
        protected readonly wallet: CrystalWalletService,
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

        this.#tokensBalancesSubscribers = new Map<string, Subscription<'contractStateChanged'>>()
        this.#tokensBalancesSubscribersMutex = new Mutex()
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
            icon: token.logoURI,
            isUpdating: false,
            isUpdatingWalletAddress: false,
            name: token.name,
            root: token.address,
            symbol: token.symbol,
            updatedAt: -1,
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
     * Returns list of the cached tokens list.
     * @returns {TokensCacheData['tokens']}
     */
    public get tokens(): TokensCacheData['tokens'] {
        return this.data.tokens
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
     * @template T
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

    /**
     * Search token by the given query string.
     * Query string can be a token symbol, name or address.
     * @param {string} query
     * @returns {TokensCacheData['tokens'][number][]}
     */
    public async search(query: string): Promise<TokensCacheData['tokens'][number][]> {
        return this.tokens.filter(token => (
            token.symbol?.toLowerCase?.().indexOf(query?.toLowerCase?.()) > -1
            || token.name?.toLowerCase?.().indexOf(query?.toLowerCase?.()) > -1
            || token.root?.toLowerCase?.().indexOf(query?.toLowerCase?.()) > -1
        ))
    }

    /**
     * Sync TON token balance with balance in network by the given token root address.
     * Pass `true` in second parameter to force update.
     * @param {string} root
     * @param {boolean} force
     * @returns {Promise<void>}
     */
    public async syncToken(root: string, force?: boolean): Promise<void> {
        if (this.wallet.address === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined || (!force && (token.isUpdating || Date.now() - token.updatedAt < 60 * 1000))) {
            return
        }

        this.update(root, 'isUpdating', true)

        if (token.wallet === undefined && !token.isUpdatingWalletAddress) {
            try {
                await this.updateTokenWalletAddress(root)
            }
            catch (e) {
                error('Sync token wallet address error', e)
                this.update(root, 'wallet', undefined)
            }
        }

        if (token.wallet !== undefined) {
            try {
                await this.updateTokenBalance(root)
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
     * Start to watch token balance updates by the given token root address.
     * @param {string} root
     * @param {string} prefix
     * @returns {Promise<void>}
     */
    public async watch(root: string, prefix: string): Promise<void> {
        if (this.wallet.address === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        try {
            await this.syncToken(root)
        }
        catch (e) {}

        if (token.wallet !== undefined) {
            const key = `${prefix}-${root}`

            await this.#tokensBalancesSubscribersMutex.use(async () => {
                const entry = this.#tokensBalancesSubscribers.get(key)

                if (entry != null || token.wallet === undefined) {
                    return
                }

                const address = new Address(token.wallet)

                const subscription = (await ton.subscribe('contractStateChanged', {
                    address,
                })).on('data', async event => {
                    debug(
                        '%cTON Provider%c The token\'s `contractStateChanged` event was captured',
                        'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                        'color: #c5e4f3',
                        event,
                    )
                    await this.syncToken(root)
                })

                this.#tokensBalancesSubscribers.set(key, subscription)

                debug(
                    `%cTON Provider%c Subscribe to a token %c${token.symbol}%c wallet (%c${token.wallet}%c) balance updates.
               Key: (${key})`,
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    'color: #bae701',
                    'color: #c5e4f3',
                    'color: #bae701',
                    'color: #c5e4f3',
                )
            })
        }
    }

    /**
     * Stop watching token balance updates by the given token root address.
     * @param {string} root
     * @param {string} prefix
     * @returns {Promise<void>}
     */
    public async unwatch(root: string, prefix: string): Promise<void> {
        if (this.wallet.address === undefined) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        const key = `${prefix}-${token.root}`

        await this.#tokensBalancesSubscribersMutex.use(async () => {
            const subscriber = this.#tokensBalancesSubscribers.get(key)

            try {
                await subscriber?.unsubscribe()
            }
            catch (e) {
                error('Cannot unsubscribe from token balance update', e)
            }

            this.#tokensBalancesSubscribers.delete(key)

            debug(
                `%cTON Provider%c Unsubscribe to a token %c${token.symbol}%c wallet (%c${token.wallet}%c) balance updates.
                Key: (${key})`,
                'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
            )
        })
    }

    /**
     * Directly update token balance by the given token root address.
     * It updates balance in the tokens list.
     * @param {string} root
     */
    public async updateTokenBalance(root: string): Promise<void> {
        if (root === undefined || this.wallet.account?.address === undefined) {
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
     * Update token wallet address by the given token root address and current wallet address.
     * @param {string} root
     * @returns {Promise<void>}
     */
    public async updateTokenWalletAddress(root: string): Promise<void> {
        if (root === undefined || (this.wallet as CrystalWalletService).account?.address === undefined) {
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
                    owner: (this.wallet.account as Account).address,
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


const TonTokensCacheServiceStore = new TonTokensCacheService(
    useCrystalWallet(),
    new TokensListService(TonConstants.TokenListURI),
)

export function useTonTokensCache(): TonTokensCacheService {
    return TonTokensCacheServiceStore
}
