import { Address, Contract, FullContractState } from 'everscale-inpage-provider'

import rpc from '@/hooks/useRpcClient'
import staticRpc from '@/hooks/useStaticRpc'
import { resolveEverscaleAddress } from '@/utils'

import {
    BridgeAbi,
    DexAbi,
    MultiVaultAbi,
    TokenAbi,
} from './abi'


export async function getFullContractState(address: Address | string): Promise<FullContractState | undefined> {
    return (await staticRpc.getFullContractState({ address: resolveEverscaleAddress(address) })).state
}

export function dexPairContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof DexAbi.Pair> {
    return new provider.Contract(DexAbi.Pair, resolveEverscaleAddress(address))
}

export function dexRootContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof DexAbi.Root> {
    return new provider.Contract(DexAbi.Root, resolveEverscaleAddress(address))
}

export function tokenRootContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof TokenAbi.Root> {
    return new provider.Contract(TokenAbi.Root, resolveEverscaleAddress(address))
}

export function tokenWalletContract(
    address: Address | string,
    provider = rpc,
): Contract<typeof TokenAbi.Wallet> {
    return new provider.Contract(TokenAbi.Wallet, resolveEverscaleAddress(address))
}

export function tokenRootAlienEvmContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.TokenRootAlienEvm> {
    return new provider.Contract(MultiVaultAbi.TokenRootAlienEvm, resolveEverscaleAddress(address))
}

export function alienProxyContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.AlienProxy> {
    return new provider.Contract(MultiVaultAbi.AlienProxy, resolveEverscaleAddress(address))
}

export function nativeProxyContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.NativeProxy> {
    return new provider.Contract(MultiVaultAbi.NativeProxy, resolveEverscaleAddress(address))
}

export function creditFactoryContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.CreditFactory> {
    return new provider.Contract(BridgeAbi.CreditFactory, resolveEverscaleAddress(address))
}

export function creditProcessorContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.CreditProcessor> {
    return new provider.Contract(BridgeAbi.CreditProcessor, resolveEverscaleAddress(address))
}

export function everscaleTokenTransferProxyContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.EverscaleProxyTokenTransfer> {
    return new provider.Contract(BridgeAbi.EverscaleProxyTokenTransfer, resolveEverscaleAddress(address))
}

export function ethereumTokenTransferProxyContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.EthereumProxyTokenTransfer> {
    return new provider.Contract(BridgeAbi.EthereumProxyTokenTransfer, resolveEverscaleAddress(address))
}

export function everscaleEventConfigurationContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.EverscaleEventConfiguration> {
    return new provider.Contract(BridgeAbi.EverscaleEventConfiguration, resolveEverscaleAddress(address))
}

export function ethereumEventConfigurationContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.EthereumEventConfiguration> {
    return new provider.Contract(BridgeAbi.EthereumEventConfiguration, resolveEverscaleAddress(address))
}

export function hiddenBridgeFactoryContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.HiddenBridgeStrategyFactory> {
    return new provider.Contract(BridgeAbi.HiddenBridgeStrategyFactory, resolveEverscaleAddress(address))
}

export function hiddenBridgeStrategyContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.HiddenBridgeStrategy> {
    return new provider.Contract(BridgeAbi.HiddenBridgeStrategy, resolveEverscaleAddress(address))
}

export function tokenTransferEverscaleEventContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.TokenTransferEverscaleEvent> {
    return new provider.Contract(BridgeAbi.TokenTransferEverscaleEvent, resolveEverscaleAddress(address))
}

export function tokenTransferEthereumEventContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.TokenTransferEthereumEvent> {
    return new provider.Contract(BridgeAbi.TokenTransferEthereumEvent, resolveEverscaleAddress(address))
}

export function mergeRouterContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.MergeRouter> {
    return new provider.Contract(MultiVaultAbi.MergeRouter, resolveEverscaleAddress(address))
}

export function mergePoolContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.MergePool> {
    return new provider.Contract(MultiVaultAbi.MergePool, resolveEverscaleAddress(address))
}

export function everscaleEventAlienContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.EverscaleEventAlien> {
    return new provider.Contract(MultiVaultAbi.EverscaleEventAlien, resolveEverscaleAddress(address))
}

export function everscaleEventNativeContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.EverscaleEventNative> {
    return new provider.Contract(MultiVaultAbi.EverscaleEventNative, resolveEverscaleAddress(address))
}
