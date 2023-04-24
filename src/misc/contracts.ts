import { Address, Contract, FullContractState } from 'everscale-inpage-provider'

import rpc from '@/hooks/useRpcClient'
import staticRpc from '@/hooks/useStaticRpc'
import { resolveEverscaleAddress } from '@/utils'

import {
    BridgeAbi,
    DexAbi, EverAbi,
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
): Contract<typeof BridgeAbi.EverscaleEthereumEventConfiguration> {
    return new provider.Contract(BridgeAbi.EverscaleEthereumEventConfiguration, resolveEverscaleAddress(address))
}

export function ethereumEventConfigurationContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.EthereumEverscaleEventConfiguration> {
    return new provider.Contract(BridgeAbi.EthereumEverscaleEventConfiguration, resolveEverscaleAddress(address))
}

export function tokenTransferEverscaleEventContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.TokenTransferEverscaleEthereumEvent> {
    return new provider.Contract(BridgeAbi.TokenTransferEverscaleEthereumEvent, resolveEverscaleAddress(address))
}

export function tokenTransferEthereumEventContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.TokenTransferEthereumEverscaleEvent> {
    return new provider.Contract(BridgeAbi.TokenTransferEthereumEverscaleEvent, resolveEverscaleAddress(address))
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
): Contract<typeof MultiVaultAbi.EverscaleEVMEventAlien> {
    return new provider.Contract(MultiVaultAbi.EverscaleEVMEventAlien, resolveEverscaleAddress(address))
}

export function everscaleEventNativeContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.EverscaleEVMEventNative> {
    return new provider.Contract(MultiVaultAbi.EverscaleEVMEventNative, resolveEverscaleAddress(address))
}

export function legacyEverscaleEventAlienContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.LegacyEverscaleEventAlien> {
    return new provider.Contract(MultiVaultAbi.LegacyEverscaleEventAlien, resolveEverscaleAddress(address))
}

export function legacyEverscaleEventNativeContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof MultiVaultAbi.LegacyEverscaleEventNative> {
    return new provider.Contract(MultiVaultAbi.LegacyEverscaleEventNative, resolveEverscaleAddress(address))
}

export function solanaTokenTransferProxyContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.SolanaProxyTokenTransfer> {
    return new provider.Contract(BridgeAbi.SolanaProxyTokenTransfer, resolveEverscaleAddress(address))
}

export function everSolEventConfigurationContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.EverscaleSolanaEventConfiguration> {
    return new provider.Contract(BridgeAbi.EverscaleSolanaEventConfiguration, resolveEverscaleAddress(address))
}

export function solEverEventConfigurationContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.SolanaEverscaleEventConfiguration> {
    return new provider.Contract(BridgeAbi.SolanaEverscaleEventConfiguration, resolveEverscaleAddress(address))
}

export function tokenTransferEverSolEventContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.TokenTransferEverscaleSolanaEvent> {
    return new provider.Contract(BridgeAbi.TokenTransferEverscaleSolanaEvent, resolveEverscaleAddress(address))
}

export function tokenTransferSolEverEventContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof BridgeAbi.TokenTransferSolanaEverscaleEvent> {
    return new provider.Contract(BridgeAbi.TokenTransferSolanaEverscaleEvent, resolveEverscaleAddress(address))
}

export function wrappedCoinVaultContract(
    address: Address | string,
    provider = staticRpc,
): Contract<typeof EverAbi.WeverVault> {
    return new provider.Contract(EverAbi.WeverVault, resolveEverscaleAddress(address))
}
