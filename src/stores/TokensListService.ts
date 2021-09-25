import { makeAutoObservable, runInAction } from 'mobx'

import { error } from '@/utils'


export type TonToken = {
    name: string;
    chainId: number;
    symbol: string;
    decimals: number;
    address: string;
    logoURI?: string;
    version?: number;
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


export class TokensListService<T = TonToken> {

    /**
     * Current state of the token list data
     * @type {TokensListData}
     * @protected
     */
    protected data: TokensListData<T> = {
        tokens: [],
    }

    /**
     * Current state of the token list
     * @type {TokensListState}
     * @protected
     */
    protected state: TokensListState = {
        isFetching: false,
    }

    constructor(uri: string) {
        makeAutoObservable(this)
        this.fetch(uri)
    }

    /**
     * Fetch tokens list manifest by the given URI
     * @param {string} uri
     */
    public fetch(uri: string): void {
        if (this.isFetching) {
            return
        }

        this.state.isFetching = true

        fetch(uri, {
            method: 'GET',
        }).then(
            value => value.json(),
        ).then((value: TonTokenListManifest<T>) => {
            runInAction(() => {
                this.data.tokens = value.tokens
                this.state = {
                    isFetching: false,
                    time: new Date().getTime(),
                    uri,
                }
            })
        }).catch(reason => {
            error('Cannot load token list', reason)
            runInAction(() => {
                this.state.isFetching = false
            })
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
