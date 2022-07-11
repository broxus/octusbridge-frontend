import { Address } from 'everscale-inpage-provider'
import { computed, makeObservable } from 'mobx'

import { BaseStore } from '@/stores/BaseStore'


export type PipelineData = {
    baseChainId?: string;
    canonicalTokenAddress?: Address;
    chainId: string;
    depositFee?: string;
    depositType: string;
    ethereumConfiguration: Address;
    everscaleConfiguration?: Address;
    everscaleTokenAddress?: Address;
    evmTokenAddress?: string;
    evmTokenBalance?: string;
    evmTokenDecimals?: number;
    from: string;
    isBlacklisted?: boolean;
    isMerged?: boolean;
    isMultiVault: boolean;
    isNative?: boolean;
    mergeEverscaleTokenAddress?: Address;
    mergeEvmTokenAddress?: string;
    mergePoolAddress?: Address;
    proxyAddress: Address;
    to: string;
    tokenBase: string;
    vaultAddress: string;
    vaultBalance?: string;
    vaultLimit?: string;
    withdrawFee?: string;
}

export class Pipeline extends BaseStore<PipelineData, any> {

    constructor(protected readonly initialData: PipelineData) {
        super()

        makeObservable(this, {
            baseChainId: computed,
            canonicalTokenAddress: computed,
            chainId: computed,
            depositFee: computed,
            depositType: computed,
            ethereumConfiguration: computed,
            everscaleConfiguration: computed,
            everscaleTokenAddress: computed,
            evmTokenAddress: computed,
            evmTokenBalance: computed,
            evmTokenDecimals: computed,
            from: computed,
            isBlacklisted: computed,
            isMerged: computed,
            isMultiVault: computed,
            isNative: computed,
            mergeEverscaleTokenAddress: computed,
            mergeEvmTokenAddress: computed,
            mergePoolAddress: computed,
            proxyAddress: computed,
            to: computed,
            tokenBase: computed,
            vaultAddress: computed,
            vaultBalance: computed,
            vaultLimit: computed,
            withdrawFee: computed,
        })

        this.setData(() => initialData)
    }

    public get<K extends keyof PipelineData & string>(key: K): PipelineData[K] {
        return this.data[key]
    }

    public get baseChainId(): PipelineData['baseChainId'] {
        return this.data.baseChainId
    }

    public get canonicalTokenAddress(): PipelineData['canonicalTokenAddress'] {
        return this.data.canonicalTokenAddress
    }

    public get chainId(): PipelineData['chainId'] {
        return this.data.chainId
    }

    public get depositFee(): PipelineData['depositFee'] {
        return this.data.depositFee
    }

    public get depositType(): PipelineData['depositType'] {
        return this.data.depositType
    }

    public get ethereumConfiguration(): PipelineData['ethereumConfiguration'] {
        return this.data.ethereumConfiguration
    }

    public get everscaleConfiguration(): PipelineData['everscaleConfiguration'] {
        return this.data.everscaleConfiguration
    }

    public get everscaleTokenAddress(): PipelineData['everscaleTokenAddress'] {
        return this.data.everscaleTokenAddress
    }

    public get evmTokenAddress(): PipelineData['evmTokenAddress'] {
        return this.data.evmTokenAddress
    }

    public get evmTokenBalance(): PipelineData['evmTokenBalance'] {
        return this.data.evmTokenBalance
    }

    public get evmTokenDecimals(): PipelineData['evmTokenDecimals'] {
        return this.data.evmTokenDecimals
    }

    public get from(): PipelineData['from'] {
        return this.data.from
    }

    public get isBlacklisted(): PipelineData['isBlacklisted'] {
        return this.data.isBlacklisted
    }

    public get isMerged(): PipelineData['isMerged'] {
        return this.data.isMerged
    }

    public get isMultiVault(): PipelineData['isMultiVault'] {
        return this.data.isMultiVault
    }

    public get isNative(): PipelineData['isNative'] {
        return this.data.isNative
    }

    public get mergeEverscaleTokenAddress(): PipelineData['mergeEverscaleTokenAddress'] {
        return this.data.mergeEverscaleTokenAddress
    }

    public get mergeEvmTokenAddress(): PipelineData['mergeEvmTokenAddress'] {
        return this.data.mergeEvmTokenAddress
    }

    public get mergePoolAddress(): PipelineData['mergePoolAddress'] {
        return this.data.mergePoolAddress
    }

    public get proxyAddress(): PipelineData['proxyAddress'] {
        return this.data.proxyAddress
    }

    public get to(): PipelineData['to'] {
        return this.data.to
    }

    public get tokenBase(): PipelineData['tokenBase'] {
        return this.data.tokenBase
    }

    public get vaultAddress(): PipelineData['vaultAddress'] {
        return this.data.vaultAddress
    }

    public get vaultBalance(): PipelineData['vaultBalance'] {
        return this.data.vaultBalance
    }

    public get vaultLimit(): PipelineData['vaultLimit'] {
        return this.data.vaultLimit
    }

    public get withdrawFee(): PipelineData['withdrawFee'] {
        return this.data.withdrawFee
    }

}
