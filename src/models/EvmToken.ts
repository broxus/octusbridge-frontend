import { computed, makeObservable } from 'mobx'

import { BaseStore } from '@/stores/BaseStore'
import type { TokenRaw } from '@/types'


export type EvmTokenData = TokenRaw<string> & {
    balance?: string;
    root: string;
}

export type EvmTokenState = {
    isSyncing: boolean;
    isSyncingBalance: boolean;
}


export class EvmToken<
    T extends EvmTokenData | Record<string, any> = EvmTokenData
> extends BaseStore<EvmTokenData & T, EvmTokenState> {

    constructor(
        protected readonly initialData: Partial<EvmTokenData & T>,
    ) {
        super()

        this.setData(() => initialData)

        this.setState(() => ({
            isSyncing: false,
            isSyncingBalance: false,
        }))

        makeObservable(this, {
            address: computed,
            balance: computed,
            chainId: computed,
            decimals: computed,
            icon: computed,
            name: computed,
            root: computed,
            symbol: computed,
        })
    }

    /**
     * Returns copy of the current token
     */
    public clone(): EvmToken<T> {
        return new EvmToken<T>(this.toJSON())
    }

    /**
     * Get custom value by the given key
     * @param {K extends keyof T & string} key
     */
    public get<K extends keyof T & string>(key: K): T[K];
    public get<K extends keyof EvmTokenData & string>(key: K): EvmTokenData[K] {
        return this.data[key]
    }

    /**
     * Returns token root address as instance of Address.
     * @returns {EvmTokenData['address']}
     */
    public get address(): EvmTokenData['address'] {
        return this.data.address
    }

    /**
     * Returns raw token balance synced with `syncBalance()` method
     */
    public get balance(): EvmTokenData['balance'] {
        return this.data.balance
    }

    /**
     *
     */
    public get chainId(): EvmTokenData['chainId'] {
        return this.data.chainId
    }

    /**
     *
     */
    public get decimals(): EvmTokenData['decimals'] {
        return this.data.decimals
    }

    /**
     *
     */
    public get icon(): EvmTokenData['logoURI'] {
        return this.data.logoURI
    }

    /**
     *
     */
    public get name(): EvmTokenData['name'] {
        return this.data.name
    }

    /**
     *
     */
    public get root(): EvmTokenData['root'] {
        return this.data.root
    }

    /**
     *
     */
    public get symbol(): EvmTokenData['symbol'] {
        return this.data.symbol
    }

}
