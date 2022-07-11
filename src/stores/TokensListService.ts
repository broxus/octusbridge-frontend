import { computed, makeObservable } from 'mobx'

import { error } from '@/utils'
import { BaseStore } from '@/stores/BaseStore'
import { TokenRaw, TokensListManifest } from '@/types'


export type TokensListData = {
    tokens: TokenRaw<string>[];
}

export type TokensListState = {
    isFetching: boolean;
    time?: number;
    uri?: string;
}


export class TokensListService extends BaseStore<TokensListData, TokensListState> {

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
        ).then((value: TokensListManifest) => {
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
    public get tokens(): TokenRaw<string>[] {
        return this.data.tokens
    }

}
