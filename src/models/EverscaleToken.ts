import { Mutex } from '@broxus/await-semaphore'
import { Address, Subscription } from 'everscale-inpage-provider'
import { computed, makeObservable } from 'mobx'

import { BaseStore } from '@/stores/BaseStore'
import staticRpc from '@/hooks/useStaticRpc'
import { TokenWallet } from '@/misc'
import type { TokenRaw } from '@/types'
import { debug, error, sliceAddress } from '@/utils'


export interface EverscaleTokenData extends TokenRaw<Address> {
    balance?: string;
    root: string;
    rootOwnerAddress?: Address;
    totalSupply?: string;
    wallet?: Address;
}

export type EverscaleTokenState = {
    isSyncing: boolean;
    isSyncingBalance: boolean;
    isSyncingWallet: boolean;
    isWatching: boolean;
}


export class EverscaleToken<
    T extends EverscaleTokenData | Record<string, any> = EverscaleTokenData
> extends BaseStore<EverscaleTokenData & T, EverscaleTokenState> {

    constructor(
        protected readonly initialData: Partial<EverscaleTokenData & T>,
    ) {
        super()

        this.setData(() => initialData)

        this.setState(() => ({
            isSyncing: false,
            isSyncingBalance: false,
            isSyncingWallet: false,
            isWatching: false,
        }))

        makeObservable(this, {
            address: computed,
            balance: computed,
            chainId: computed,
            decimals: computed,
            icon: computed,
            isSyncing: computed,
            isSyncingBalance: computed,
            isSyncingWallet: computed,
            name: computed,
            root: computed,
            rootOwnerAddress: computed,
            symbol: computed,
            totalSupply: computed,
            vendor: computed,
            verified: computed,
            wallet: computed,
        })
    }

    /**
     * Sync token balance with balance in network by the given token root address.
     * Pass `true` in second parameter to force update.
     * @param {Address} owner
     * @param {boolean} [force]
     * @returns {Promise<void>}
     */
    public async sync(owner: Address, force?: boolean): Promise<void> {
        if (!force && this.isSyncing) {
            return
        }

        this.setState('isSyncing', true)

        if (force || (this.wallet === undefined && !this.isSyncingWallet)) {
            try {
                await this.syncWalletAddress(owner)
            }
            catch (e) {
                error('Sync token wallet address error', e)
                this.setData('wallet', undefined)
            }
        }

        if (this.wallet !== undefined && !this.isSyncingBalance) {
            try {
                await this.syncBalance(this.wallet)
            }
            catch (e) {
                error('Sync token balance error', e)
                this.setData('balance', undefined)
            }
        }

        this.setState('isSyncing', false)
    }

    /**
     * Directly update token balance by the given token root address.
     * It updates balance in the tokens list.
     */
    public async syncBalance(wallet: Address | undefined = this.wallet): Promise<void> {
        if (this.isSyncingBalance || wallet === undefined) {
            return
        }

        this.setState('isSyncingBalance', true)

        try {
            const balance = await TokenWallet.balance({
                wallet,
            })

            this.setData('balance', balance)
        }
        catch (e) {
            error('Sync balance error', e)
            this.setData('balance', undefined)
        }
        finally {
            this.setState('isSyncingBalance', false)
        }
    }

    /**
     * Update token wallet address by the given token root address and current wallet address.
     * @returns {Promise<void>}
     */
    public async syncWalletAddress(owner?: Address): Promise<void> {
        if (this.isSyncingWallet || owner === undefined) {
            return
        }

        this.setState('isSyncingWallet', true)

        try {
            const address = await TokenWallet.walletAddress({
                root: this.address,
                owner,
            })
            this.setData('wallet', address)
        }
        catch (e) {
            error('Sync wallet address error', e)
        }
        finally {
            this.setState('isSyncingWallet', false)
        }
    }

    /**
     * Start to watch token balance updates by the given token root address.
     * @param {Address} owner
     * @returns {Promise<Subscription<'contractStateChanged'> | undefined>}
     */
    public async watch(owner: Address): Promise<Subscription<'contractStateChanged'> | undefined> {
        if (this.wallet === undefined) {
            return undefined
        }

        try {
            await this.sync(owner)
        }
        catch (e) {}

        await this.mutex.use(async () => {
            this.balanceSubscriber = (await staticRpc.subscribe('contractStateChanged', {
                address: this.address,
            })).on('data', async event => {
                debug(
                    '%cRPC%c The token\'s `contractStateChanged` event was captured',
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    event,
                )
                await this.sync(owner)
            })

            this.setState('isWatching', true)

            debug(
                `%cRPC%c Subscribe to a token %c${this.symbol}%c wallet (%c${sliceAddress(this.wallet?.toString())}%c) balance updates.`,
                'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
            )
        })

        return this.balanceSubscriber
    }

    /**
     * Stop watching token balance updates by the given token root address.
     * @returns {Promise<void>}
     */
    public async unwatch(): Promise<void> {
        await this.mutex.use(async () => {
            try {
                await this.balanceSubscriber?.unsubscribe()
            }
            catch (e) {
                error('Cannot unsubscribe from token balance subscriber', e)
            }

            debug(
                `%cRPC%c Unsubscribe from a token %c${this.symbol}%c balance updates.`,
                'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                'color: #c5e4f3',
                'color: #bae701',
                'color: #c5e4f3',
            )
        })
    }

    /**
     * Returns copy of the current token
     */
    public clone(): EverscaleToken<T> {
        return new EverscaleToken<T>(this.toJSON())
    }

    /**
     * Get custom value by the given key
     * @param {K extends keyof T & string} key
     */
    public get<K extends keyof T & string>(key: K): T[K]
    public get<K extends keyof EverscaleTokenData & string>(key: K): EverscaleTokenData[K] {
        return this.data[key]
    }

    /**
     * Returns token root address as instance of Address.
     * @returns {EverscaleTokenData['address']}
     */
    public get address(): EverscaleTokenData['address'] {
        return this.data.address
    }

    /**
     * Returns raw token balance synced with `syncBalance()` method
     */
    public get balance(): EverscaleTokenData['balance'] {
        return this.data.balance
    }

    /**
     *
     */
    public get chainId(): EverscaleTokenData['chainId'] {
        return this.data.chainId
    }

    /**
     *
     */
    public get decimals(): EverscaleTokenData['decimals'] {
        return this.data.decimals
    }

    /**
     *
     */
    public get icon(): EverscaleTokenData['logoURI'] {
        return this.data.logoURI
    }

    /**
     *
     */
    public get name(): EverscaleTokenData['name'] {
        return this.data.name
    }

    /**
     *
     */
    public get root(): EverscaleTokenData['root'] {
        return this.data.root
    }

    /**
     *
     */
    public get symbol(): EverscaleTokenData['symbol'] {
        return this.data.symbol
    }

    /**
     *
     */
    public get rootOwnerAddress(): EverscaleTokenData['rootOwnerAddress'] {
        return this.data.rootOwnerAddress
    }

    /**
     *
     */
    public get totalSupply(): EverscaleTokenData['totalSupply'] {
        return this.data.totalSupply
    }

    /**
     *
     */
    public get vendor(): EverscaleTokenData['vendor'] {
        return this.data.vendor
    }

    /**
     *
     */
    public get verified(): EverscaleTokenData['verified'] {
        return this.data.verified
    }

    /**
     *
     */
    public get wallet(): EverscaleTokenData['wallet'] {
        return this.data.wallet
    }

    /**
     *
     */
    public get isSyncing(): EverscaleTokenState['isSyncing'] {
        return this.state.isSyncing
    }

    /**
     *
     */
    public get isSyncingBalance(): EverscaleTokenState['isSyncingBalance'] {
        return this.state.isSyncingBalance
    }

    /**
     *
     */
    public get isSyncingWallet(): EverscaleTokenState['isSyncingWallet'] {
        return this.state.isSyncingWallet
    }

    /**
     * Everscale Subscription for the contract state changes.
     * @type {Subscription<'contractStateChanged'>}
     * @private
     */
    protected balanceSubscriber: Subscription<'contractStateChanged'> | undefined

    /**
     * Subscribers map mutex. Used to prevent duplicate subscriptions
     * @type Mutex
     * @private
     */
    protected mutex = new Mutex()

}
