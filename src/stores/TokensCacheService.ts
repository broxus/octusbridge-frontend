import { Mutex } from '@broxus/await-semaphore'
import {
    action,
    computed,
    makeObservable,
    reaction,
    runInAction,
} from 'mobx'
import {
    Address,
    Contract,
    ProviderEventData,
    Subscription,
} from 'everscale-inpage-provider'

import { TokenListURI } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { TokenAbi, TokenWallet } from '@/misc'
import { BaseStore } from '@/stores/BaseStore'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { TokensListService } from '@/stores/TokensListService'
import {
    debug,
    error,
    isEverscaleAddressValid,
    sliceAddress,
    storage,
    warn,
} from '@/utils'
import { TokenCache } from '@/types'


export type TokensCacheData<T> = {
    tokens: T[];
}

export type TokensCacheState<T> = {
    isImporting: boolean;
    isReady: boolean;
    queue: T[];
    updatingTokens: Map<string, boolean>;
    updatingTokensBalance: Map<string, boolean>;
    updatingTokensWallet: Map<string, boolean>;
}

export type TokensCacheCtorOptions = {
    useBuildListener?: boolean;
    withImportedTokens?: boolean;
}


export const IMPORTED_TOKENS_STORAGE_KEY = 'imported_tokens'


export function getImportedTokens(): string[] {
    return JSON.parse(storage.get(IMPORTED_TOKENS_STORAGE_KEY) || '[]')
}


export class TokensCacheService<
    T extends TokenCache | Record<string, any> = TokenCache,
    U extends TokensCacheData<T> | Record<string, any> = TokensCacheData<T>,
    V extends TokensCacheState<T> | Record<string, any> = TokensCacheState<T>
> extends BaseStore<U, V> {

    constructor(
        protected readonly wallet: EverWalletService,
        protected readonly tokensList: TokensListService,
        protected readonly options?: TokensCacheCtorOptions,
    ) {
        super()

        const { useBuildListener = true } = { ...options }

        this.setData('tokens', [])

        this.setState({
            isImporting: false,
            isReady: false,
            queue: [],
            updatingTokens: new Map<string, boolean>(),
            updatingTokensBalance: new Map<string, boolean>(),
            updatingTokensWallet: new Map<string, boolean>(),
        })

        makeObservable<TokensCacheService<T, U, V>, '_byRoot' | '_verifiedByRoot'>(this, {
            _byRoot: computed,
            _verifiedByRoot: computed,
            add: action.bound,
            tokens: computed,
            verifiedTokens: computed,
            roots: computed,
            isFetching: computed,
            isImporting: computed,
            isReady: computed,
            queue: computed,
            currentImportingToken: computed,
            onImportConfirm: action.bound,
            onImportDismiss: action.bound,
        })

        if (useBuildListener) {
            // When the Tokens List Service has loaded the list of
            // available tokens, we will start creating a token map
            reaction(
                () => [tokensList.time, tokensList.tokens, wallet.address],
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
        }

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
            this.setState('isReady', false)
            return
        }

        this.setState('isReady', false)

        this.setData('tokens', this.tokensList?.tokens.map(token => ({
            balance: undefined,
            decimals: token.decimals,
            icon: token.logoURI,
            name: token.name,
            root: token.address.toLowerCase?.(),
            symbol: token.symbol,
            updatedAt: -1,
            vendor: token.vendor,
            verified: token.verified,
            wallet: undefined,
        })))

        if (this.options?.withImportedTokens) {
            const importedTokens = getImportedTokens()

            if (importedTokens.length > 0) {
                importedTokens.forEach(root => {
                    this.add({ root } as T)
                })

                const results = await Promise.allSettled(
                    importedTokens.map(root => TokenWallet.getTokenFullDetails(root)),
                ).then(response => response.map(
                    r => (r.status === 'fulfilled' ? r.value : undefined),
                ).filter(e => e !== undefined)) as T[]

                results.forEach(this.add)
            }
        }

        this.setState('isReady', true)
    }

    /**
     * Returns tokens map where key is a token root address.
     * @protected
     */
    protected get _byRoot(): Record<string, T> {
        const entries: Record<string, T> = {}
        this.tokens.forEach(token => {
            entries[token.root] = token
        })
        return entries
    }

    /**
     * Returns verified tokens map where key is a token root address.
     * @protected
     */
    protected get _verifiedByRoot(): Record<string, T> {
        const entries: Record<string, T> = {}
        this.tokens.forEach(token => {
            if (token.verified) {
                entries[token.root] = token
            }
        })
        return entries
    }

    /**
     * Returns list of the cached tokens list.
     * @template T
     * @returns {T['tokens']}
     */
    public get tokens(): T[] {
        return this.data.tokens
    }

    /**
     * Returns only verified tokens
     */
    public get verifiedTokens(): T[] {
        return this.tokens.filter(token => token.verified)
    }

    /**
     * Returns list of the cached tokens root addresses.
     * @returns {string[]}
     */
    public get roots(): string[] {
        return this.tokens.map(token => token.root)
    }

    /**
     * Returns token by the given token root address.
     * @template T
     * @param {string} [root]
     * @param {boolean} [verified]
     * @returns {T}
     */
    public get(root?: string, verified: boolean = false): T | undefined {
        if (root === undefined) {
            return undefined
        }
        if (verified) {
            return this._verifiedByRoot[root.toLowerCase?.()]
        }
        return this._byRoot[root.toLowerCase?.()]
    }

    /**
     * Check if token was stored to the cache.
     * @param {string} [root]
     * @returns {boolean}
     */
    public has(root?: string): boolean {
        return this.get(root) !== undefined
    }

    /**
     * Add a new token to the tokens list.
     * @template T
     * @param {T} token
     */
    public add(token: T): void {
        if (this.has(token.root)) {
            this.setData('tokens', this.tokens.map(item => {
                if (item.root === token.root.toLowerCase?.()) {
                    return { ...item, ...token }
                }
                return item
            }))
        }
        else {
            const tokens = this.tokens.slice()
            tokens.push({ ...token, root: token.root?.toLowerCase?.() })
            this.setData('tokens', tokens)
        }
    }

    /**
     * Remove a given token from the tokens list.
     * @template T
     * @param {T} token
     */
    public remove(token: T): void {
        this.setData('tokens', this.tokens.filter(item => item.root !== token.root?.toLowerCase?.()))
    }

    /**
     * Update token field by the given root address, key and value.
     * @template T
     * @template {K extends keyof T & string} K
     * @param {string} root
     * @param {K} key
     * @param {T[K]} value
     */
    public update<K extends keyof T & string>(root: string, key: K, value: T[K]): void {
        this.setData('tokens', this.tokens.map(token => {
            if (token.root === root.toLowerCase?.()) {
                return { ...token, [key]: value }
            }
            return token
        }))
    }

    /**
     *
     */
    public get isFetching(): boolean {
        return this.tokensList.isFetching
    }

    /**
     *
     * @param {string} root
     */
    public isTokenUpdating(root: string): boolean {
        return this.state.updatingTokens.get(root) || false
    }

    /**
     *
     * @param {string} root
     */
    public isTokenUpdatingBalance(root?: string): boolean {
        return (root === undefined ? false : this.state.updatingTokensBalance.get(root)) || false
    }

    /**
     *
     * @param {string} root
     */
    public isTokenUpdatingWallet(root?: string): boolean {
        return (root === undefined ? false : this.state.updatingTokensWallet.get(root)) || false
    }

    /**
     * Returns Everscale token wallet Contract by the given token `root`
     * @param {string} root
     */
    public async getTokenWalletContract(root: string): Promise<Contract<typeof TokenAbi.Wallet> | undefined> {
        let wallet = this.get(root)?.wallet

        if (wallet === undefined) {
            await this.syncTokenWalletAddress(root)
        }

        wallet = this.get(root)?.wallet

        if (wallet === undefined) {
            return undefined
        }

        return new rpc.Contract(TokenAbi.Wallet, new Address(wallet))
    }

    /**
     * Search token by the given query string.
     * Query string can be a token symbol, name or address.
     * @template T
     * @param {string} query
     * @returns {Promise<T[]>}
     */
    public async search(query: string): Promise<T[]> {
        const filtered = this.tokens.filter(token => (
            token.symbol?.toLowerCase?.().includes(query?.toLowerCase?.())
            || token.name?.toLowerCase?.().includes(query?.toLowerCase?.())
            || token.root?.toLowerCase?.().includes(query?.toLowerCase?.())
        ))

        if (filtered.length === 0 && isEverscaleAddressValid(query)) {
            try {
                const token = await TokenWallet.getTokenFullDetails(query)
                if (token !== undefined) {
                    filtered.push(token as T)
                }
            }
            catch (e) {}
        }

        return filtered
    }

    /**
     * Sync token balance with balance in the network by the given token root address.
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

        if (
            token === undefined
            || (!force && (this.isTokenUpdating(root) || (Date.now() - (token.updatedAt || 0) < 60 * 1000)))
        ) {
            return
        }

        this.state.updatingTokens.set(root, true)

        if (token.wallet === undefined) {
            try {
                await this.syncTokenWalletAddress(root, force)
            }
            catch (e) {
                error('Sync token wallet address error', e)
                this.update(root, 'wallet', undefined)
            }
        }

        if (token.wallet !== undefined) {
            try {
                await this.syncTokenBalance(root, force)
            }
            catch (e) {
                warn('Sync token balance error', e)
                this.update(root, 'balance', undefined)
            }
        }

        this.update(root, 'updatedAt', Date.now())
        this.state.updatingTokens.set(root, false)
    }

    /**
     * Sync custom token
     * @param {string} root
     * @returns {Promise<void>}
     */
    public async syncCustomToken(root: string): Promise<void> {
        try {
            if (this.has(root)) {
                return
            }

            const token = await TokenWallet.getTokenFullDetails(root)

            if (token === undefined || this.has(token.root)) {
                return
            }

            this.add(token as T)
        }
        catch (e) {
            error('Sync custom token error', e)
        }
    }

    /**
     * Start to watch token balance updates by the given token root address.
     * @param {string} [root]
     * @param {string} [prefix]
     * @param [callback]
     * @returns {Promise<void>}
     */
    public async watch(
        root?: string,
        callback?: (data: ProviderEventData<'contractStateChanged'>) => void,
        prefix: string = '',
    ): Promise<void> {
        if (this.wallet.address === undefined || root === undefined) {
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
            const key = `${prefix}-${(root)}`

            await this.#tokensBalancesSubscribersMutex.use(async () => {
                const entry = this.#tokensBalancesSubscribers.get(key)

                if (entry != null || token.wallet === undefined) {
                    debug('Reset token subscription')
                    return
                }

                const address = new Address(token.wallet)

                const subscription = (await rpc.subscribe('contractStateChanged', {
                    address,
                })).on('data', async event => {
                    debug(
                        `'%cRPC%c %c${token.symbol}%c \`contractStateChanged\` event was captured'`,
                        'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                        'color: #c5e4f3',
                        'color: #bae701',
                        'color: #c5e4f3',
                        event,
                    )
                    callback?.(event)
                    await this.syncToken(root, true)
                })

                this.#tokensBalancesSubscribers.set(key, subscription)

                debug(
                    `%cRPC%c Subscribe to the %c${token.symbol}%c token wallet %c${sliceAddress(token.wallet)}%c balance updates with key %c${prefix}-${sliceAddress(root)}`,
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    'color: #bae701',
                    'color: #c5e4f3',
                    'color: #bae701',
                    'color: #c5e4f3',
                    'color: #bae701',
                )
            })
        }
    }

    /**
     * Stop watching token balance updates by the given token root address.
     * @param {string} [root]
     * @param {string} [prefix]
     * @returns {Promise<void>}
     */
    public async unwatch(root?: string, prefix: string = ''): Promise<void> {
        if (this.wallet.address === undefined || root === undefined) {
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
                `%cRPC%c Unsubscribe from the %c${token.symbol}%c token wallet %c${sliceAddress(token.wallet)}%c balance updates with key %c${prefix}-${sliceAddress(root)}`,
                'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
                'color: #bae701',
            )
        })
    }

    /**
     * Directly update token balance by the given token root address.
     * It updates balance in the tokens list.
     * @param {string} root
     * @param {boolean} [force]
     */
    public async syncTokenBalance(root: string, force: boolean = false): Promise<void> {
        if (
            root === undefined
            || (!force && this.isTokenUpdatingBalance(root))
        ) {
            return
        }

        const token = this.get(root)

        if (token === undefined || token.wallet === undefined) {
            return
        }

        try {
            this.state.updatingTokensBalance.set(root, true)

            const balance = await TokenWallet.balance({
                wallet: new Address(token.wallet),
            })

            // Force update
            runInAction(() => {
                token.balance = balance
            })

            this.update(root, 'balance', balance)
        }
        catch (e: any) {
            warn('Cannot update token balance. Wallet account of this token not created yet ->', e.message)
            this.update(root, 'balance', undefined)
        }
        finally {
            this.state.updatingTokensBalance.set(root, false)
        }
    }

    /**
     * Update token wallet address by the given token root address and current wallet address.
     * @param {string} root
     * @param {boolean} [force]
     */
    public async syncTokenWalletAddress(root: string, force: boolean = false): Promise<void> {
        if (
            root === undefined
            || this.wallet.account?.address === undefined
            || (!force && this.isTokenUpdatingWallet(root))
        ) {
            return
        }

        const token = this.get(root)

        if (token === undefined) {
            return
        }

        if (token.wallet === undefined) {
            this.state.updatingTokensWallet.set(root, true)

            try {
                const address = await TokenWallet.walletAddress({
                    owner: this.wallet.account.address,
                    root: new Address(token.root),
                })

                // Force update
                runInAction(() => {
                    token.wallet = address.toString()
                })

                this.update(root, 'wallet', address.toString())
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
     * Import custom token to the list.
     * Saves token root address to the localStorage.
     * @template T
     * @param {T} token
     */
    public import(token: T): void {
        try {
            const importedTokens = getImportedTokens()
            if (!importedTokens.includes(token.root)) {
                importedTokens.push(token.root)
                storage.set(IMPORTED_TOKENS_STORAGE_KEY, JSON.stringify(importedTokens))
            }
            this.add(token)
        }
        catch (e) {
            error('Can\'t import token', e)
        }
    }

    /**
     *
     */
    public get isImporting(): TokensCacheState<T>['isImporting'] {
        return this.state.isImporting
    }

    /**
     *
     */
    public get isReady(): TokensCacheState<T>['isReady'] {
        return this.state.isReady
    }

    /**
     *
     */
    public get queue(): TokensCacheState<T>['queue'] {
        return this.state.queue
    }

    /**
     *
     */
    public get currentImportingToken(): T | undefined {
        return this.queue.slice().shift()
    }

    /**
     *
     * @param {string} [root]
     */
    public async addToImportQueue(root?: string): Promise<void> {
        if (root === undefined || !isEverscaleAddressValid(root)) {
            return
        }

        try {
            const customToken = await TokenWallet.getTokenFullDetails(root)

            if (customToken) {
                const filtered = this.queue.filter(token => token.root !== root)
                filtered.push(customToken as T)
                this.setState('queue', filtered)
                this.setState('isImporting', true)
            }
            else {
                this.setState('isImporting', this.queue.length > 0)
            }
        }
        catch (e) {
            error(e)
            this.setState('isImporting', this.queue.length > 0)
        }
    }

    /**
     *
     */
    public onImportDismiss(): void {
        const queue = this.queue.slice()
        queue.shift()
        this.setState({
            isImporting: queue.length > 0,
            queue,
        })
    }

    /**
     *
     */
    public onImportConfirm(token: T): void {
        this.import(token)
        const queue = this.queue.slice()
        queue.shift()
        this.setState({
            isImporting: queue.length > 0,
            queue,
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


let service: TokensCacheService

export function useTokensCache(): TokensCacheService {
    if (service === undefined) {
        service = new TokensCacheService(
            useEverWallet(),
            new TokensListService(TokenListURI),
            { withImportedTokens: true },
        )
    }
    return service
}
