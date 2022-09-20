import { PublicKey } from '@solana/web3.js'
import { computed, makeObservable } from 'mobx'

import { BaseStore } from '@/stores/BaseStore'
import type { TokenRaw } from '@/types'


export type SolanaTokenData = TokenRaw<PublicKey> & {
    balance?: string;
    root: string;
}

export type SolanaTokenState = {
    isSyncing: boolean;
    isSyncingBalance: boolean;
}


export class SolanaToken<
    T extends SolanaTokenData | Record<string, any> = SolanaTokenData
    > extends BaseStore<SolanaTokenData & T, SolanaTokenState> {

    constructor(
        protected readonly initialData: Partial<SolanaTokenData & T>,
    ) {
        super()

        this.setData(() => initialData as SolanaTokenData)

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
    public clone(): SolanaToken<T> {
        return new SolanaToken<T>(this.toJSON())
    }

    /**
     * Get custom value by the given key
     * @param {K extends keyof T & string} key
     */
    public get<K extends keyof T & string>(key: K): T[K];
    public get<K extends keyof SolanaTokenData & string>(key: K): SolanaTokenData[K] {
        return this.data[key]
    }

    /**
     * Returns token root address as instance of Address.
     * @returns {SolanaTokenData['address']}
     */
    public get address(): SolanaTokenData['address'] {
        return this.data.address
    }

    /**
     * Returns raw token balance synced with `syncBalance()` method
     */
    public get balance(): SolanaTokenData['balance'] {
        return this.data.balance
    }

    /**
     *
     */
    public get chainId(): SolanaTokenData['chainId'] {
        return this.data.chainId
    }

    /**
     *
     */
    public get decimals(): SolanaTokenData['decimals'] {
        return this.data.decimals
    }

    /**
     *
     */
    public get icon(): SolanaTokenData['logoURI'] {
        return this.data.logoURI
    }

    /**
     *
     */
    public get name(): SolanaTokenData['name'] {
        return this.data.name
    }

    /**
     *
     */
    public get root(): SolanaTokenData['root'] {
        return this.data.root
    }

    /**
     *
     */
    public get symbol(): SolanaTokenData['symbol'] {
        return this.data.symbol
    }

}
