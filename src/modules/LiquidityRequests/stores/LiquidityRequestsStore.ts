import { makeAutoObservable, runInAction, toJS } from 'mobx'

import { error, findNetwork, lastOfCalls } from '@/utils'
import { handleLiquidityRequests } from '@/modules/LiquidityRequests/utils'
import { SearchNotInstant, SearchNotInstantRequest, SearchNotInstantResponse } from '@/modules/LiquidityRequests/types'
import { BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { BridgeUtils } from '@/misc/BridgeUtils'

type Data = {
    liquidityRequests?: SearchNotInstantResponse;
    evmTokenDecimals: {[k: string]: number};
}

type State = {
    isLoaded?: boolean;
    isLoading?: boolean;
    selected: SearchNotInstant[];
}

export class LiquidityRequestsStore {

    protected data: Data = {
        evmTokenDecimals: {},
    }

    protected state: State = {
        selected: [],
    }

    protected handleLiquidityRequests = lastOfCalls(handleLiquidityRequests)

    constructor(
        protected bridgeAssets: BridgeAssetsService,
    ) {
        makeAutoObservable(this)
    }

    public async fetch(params: SearchNotInstantRequest): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })
            const result = await this.handleLiquidityRequests(params)
            if (result) {
                this.syncResultDecimals(result.transfers)
                runInAction(() => {
                    this.data.liquidityRequests = result
                })
            }
        }
        catch (e) {
            error(e)
        }
        finally {
            runInAction(() => {
                this.state.isLoaded = true
                this.state.isLoading = false
            })
        }
    }

    protected async syncResultDecimals(data: SearchNotInstant[]): Promise<void> {
        for (let i = 0; i < data.length; i++) {
            await this.syncEvmTokenDecimals(
                data[i].ethTokenAddress,
                data[i].chainId.toString(),
            )
        }
    }

    protected async syncEvmTokenDecimals(evmTokenAddress: string, chainId: string): Promise<void> {
        try {
            if (this.getEvmTokenDecimals(evmTokenAddress, chainId) !== undefined) {
                return
            }

            const network = findNetwork(chainId, 'evm')
            if (network === undefined) {
                return
            }

            const decimals = await BridgeUtils.getEvmTokenDecimals(evmTokenAddress, network.rpcUrl)
            runInAction(() => {
                this.data.evmTokenDecimals[`${chainId}.${evmTokenAddress}`] = decimals
            })
        }
        catch (e) {
            error(e)
        }
    }

    public toggleTransfer(transfer: SearchNotInstant): void {
        const index = this.state.selected
            .findIndex(item => item.contractAddress === transfer.contractAddress)
        let selected

        if (index > -1) {
            selected = this.state.selected.filter((_, idx) => idx !== index)
        }
        else {
            selected = [...this.state.selected, transfer]
        }

        selected = selected.filter(item => (
            item.chainId === transfer.chainId && item.ethTokenAddress === transfer.ethTokenAddress
        ))

        this.state.selected = selected
    }

    public getEvmTokenDecimals(evmTokenAddress: string, chainId: string): number | undefined {
        return this.data.evmTokenDecimals?.[`${chainId}.${evmTokenAddress}`]
    }

    public get transfers(): SearchNotInstant[] {
        return toJS(this.data.liquidityRequests?.transfers ?? [])
    }

    public get selected(): SearchNotInstant[] {
        return toJS(this.state.selected)
    }

    public get totalCount(): number | undefined {
        return this.data.liquidityRequests?.totalCount
    }

    public get isLoading(): boolean | undefined {
        return this.state.isLoading
    }

    public get isLoaded(): boolean | undefined {
        return this.state.isLoaded
    }

    public get isReady(): boolean {
        return this.bridgeAssets.isReady
    }

}
