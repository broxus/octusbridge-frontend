import { computed, makeObservable } from 'mobx'

import { error } from '@/utils'
import { BaseStore } from '@/stores/BaseStore'


export type TonToken = {
    name: string;
    chainId: number;
    symbol: string;
    decimals: number;
    address: string;
    logoURI?: string;
    version?: number;
    vendor: string;
    verified: boolean;
}

export type TonTokenListManifest<T> = {
    name: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    keywords: string[];
    timestamp: string;
    tokens: T[];
}

export type TokensListData<T> = {
    tokens: T[];
}

export type TokensListState = {
    isFetching: boolean;
    time?: number;
    uri?: string;
}


export class TokensListService<T = TonToken> extends BaseStore<TokensListData<T>, TokensListState> {

    constructor(uri: string) {
        super()

        this.setData('tokens', [])

        this.setState('isFetching', false)

        makeObservable(this, {
            isFetching: computed,
            time: computed,
            tokens: computed,
        });

        (async () => {
            await this.fetch(uri)
        })()
    }

    /**
     * Fetch tokens list manifest by the given URI
     * @param {string} uri
     */
    public async fetch(uri: string): Promise<void> {
        if (this.isFetching) {
            return
        }

        this.setState('isFetching', true)

        await fetch(uri, {
            method: 'GET',
        }).then(
            value => value.json(),
        ).then((value: TonTokenListManifest<T>) => {
            this.setData('tokens', value.tokens)
            this.setState({
                isFetching: false,
                time: new Date().getTime(),
                uri,
            })
        }).catch(reason => {
            error('Cannot load token list', reason)
            this.setState('isFetching', false)
        })
    }

    /**
     * Returns computed fetching state value
     */
    public get isFetching(): boolean {
        return this.state.isFetching
    }

    /**
     * Returns computed last fetching timestamp
     */
    public get time(): number | undefined {
        return this.state.time
    }

    /**
     * Returns computed Ton tokens list
     */
    public get tokens(): T[] {
        return this.data.tokens
    }

}
