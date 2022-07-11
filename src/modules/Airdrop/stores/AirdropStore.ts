import {
    IReactionDisposer, makeAutoObservable, reaction, runInAction,
} from 'mobx'
import { Contract } from 'everscale-inpage-provider'
import BigNumber from 'bignumber.js'

import { AirdropContractAddress } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { TokenWallet, TonAirdrop } from '@/misc'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { error, isGoodBignumber } from '@/utils'
import { TokenCache } from '@/types'


export type AirdropStoreData = {
    amount: string;
    decimals: number;
    tokenRoot?: string;
}

export type AirdropStoreState = {
    isClaiming: boolean;
    isFetching: boolean;
}


export class AirdropStore {

    protected data: AirdropStoreData

    protected state: AirdropStoreState

    constructor(
        protected readonly tonWallet: EverWalletService,
        protected readonly tokenCache: TokensCacheService,
    ) {
        this.data = {
            amount: '0',
            decimals: 9,
        }
        this.state = {
            isClaiming: false,
            isFetching: false,
        }

        makeAutoObservable(this);

        (async () => {
            await this.init()
        })()
    }

    public init(): void {

        this.#tonWalletDisposer = reaction(() => this.tonWallet.address, async () => {
            await this.fetch()
        }, {
            fireImmediately: true,
        })

    }

    public get canClaim(): boolean {
        return isGoodBignumber(new BigNumber(this.amount))
    }

    public async claim(): Promise<void> {
        if (this.tonWallet.account?.address === undefined) {
            return
        }

        runInAction(() => {
            this.state.isClaiming = true
        })

        try {
            await AirdropStore.airdropContract.methods.claim({}).send({
                amount: '2100000000',
                from: this.tonWallet.account?.address,
            })
            runInAction(() => {
                this.data.amount = '0'
            })
        }
        catch (e) {
            error('Claim error', e)
        }
        finally {
            runInAction(() => {
                this.state.isClaiming = false
            })
        }
    }

    public async fetch(): Promise<void> {
        if (this.tonWallet.account?.address === undefined) {
            return
        }

        runInAction(() => {
            this.state.isFetching = true
        })

        try {
            // @ts-ignore
            const { _token } = await AirdropStore.airdropContract.methods.getDetails({}).call()
            const response = await Promise.all([
                AirdropStore.airdropContract.methods.getCurrentClaimable({
                    user: this.tonWallet.account.address,
                }).call(),
                TokenWallet.getDetails(_token),
            ])

            runInAction(() => {
                this.data.amount = response[0]?._amount ?? '0'
                this.data.decimals = parseInt(response[1].decimals.toString(), 10)
                this.data.tokenRoot = _token.toString()
            })
        }
        catch (e) {
            error(e)
        }
        finally {
            runInAction(() => {
                this.state.isFetching = false
            })
        }
    }

    public get token(): TokenCache | undefined {
        return this.data.tokenRoot ? this.tokenCache.get(this.data.tokenRoot) : undefined
    }

    public get amount(): AirdropStoreData['amount'] {
        return new BigNumber(this.data.amount ?? 0)
            .shiftedBy(-this.data.decimals)
            .toFixed()
    }

    public get isClaiming(): AirdropStoreState['isClaiming'] {
        return this.state.isClaiming
    }

    public get isFetching(): AirdropStoreState['isFetching'] {
        return this.state.isFetching
    }

    public static get airdropContract(): Contract<typeof TonAirdrop.Airdrop> {
        return new rpc.Contract(TonAirdrop.Airdrop, AirdropContractAddress)
    }

    public get useTonWallet(): EverWalletService {
        return this.tonWallet
    }

    #tonWalletDisposer: IReactionDisposer | undefined

}


const AirdropStoreSingleton = new AirdropStore(
    useEverWallet(),
    useTokensCache(),
)

export function useAirdropStore(): AirdropStore {
    return AirdropStoreSingleton
}
