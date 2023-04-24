import { Connection, type PublicKey } from '@solana/web3.js'
import { getMint } from '@solana/spl-token'
import BigNumber from 'bignumber.js'
import { type Address,
    type DecodedAbiFunctionInputs,
    type DecodedAbiFunctionOutputs,
    type FullContractState,
} from 'everscale-inpage-provider'

import { type MultiVaultAbi } from '@/misc/abi'
import {
    alienProxyContract,
    getFullContractState,
    mergePoolContract,
    mergeRouterContract,
    tokenRootAlienEvmContract,
} from '@/misc/contracts'
import {
    erc20TokenContract,
    evmMultiVaultContract,
    evmVaultContract,
} from '@/misc/eth-contracts'
import { resolveEverscaleAddress } from '@/utils'


export type EvmMultiVaultTokenMeta = {
    activation: string;
    blacklisted: boolean;
    custom: string
    depositFee: string;
    isNative: boolean;
    withdrawFee: string;
}

export type MergedTokenDetails = {
    canonicalTokenAddress?: Address;
    isMerged: boolean
    mergeEverscaleTokenAddress?: Address;
    mergeEvmTokenAddress?: string;
    mergePoolAddress?: Address;
}


export abstract class BridgeUtils {

    /**
     * Get EVM token meta in MultiVault by the given vault and token addresses
     * @param {string} vaultAddress - vault address (eg. 0x00...0000)
     * @param {string} tokenAddress - token address (eg. 0x00...0000)
     * @param {string} rpcUrl
     */
    public static async getEvmMultiVaultTokenMeta(
        vaultAddress: string,
        tokenAddress: string,
        rpcUrl: string,
    ): Promise<EvmMultiVaultTokenMeta> {
        return evmMultiVaultContract(vaultAddress, rpcUrl).methods.tokens(tokenAddress).call()
    }

    /**
     * Get EVM native token address in MultiVault by the given vault and
     * Everscale-like token addresses
     * @param {string} vaultAddress - vault address (eg. 0x00...0000)
     * @param {string} tokenAddress - token address (eg. 0:00...0000)
     * @param {string} rpcUrl
     */
    public static async getEvmMultiVaultNativeToken(
        vaultAddress: string,
        tokenAddress: Address | string,
        rpcUrl: string,
    ): Promise<string> {
        const [nativeWid, nativeAddress] = tokenAddress.toString().split(':')
        // const nativeToken = await evmMultiVaultContract(vaultAddress, rpcUrl).methods.getNativeToken([nativeWid, `0x${nativeAddress}`]).call()
        // const customToken = await evmMultiVaultContract(vaultAddress, rpcUrl).methods.tokens(nativeToken).call()
        // console.log(customToken, customToken.custom, nativeToken)
        // return customToken.custom === '0x0000000000000000000000000000000000000000' ? nativeToken : customToken.custom
        return evmMultiVaultContract(vaultAddress, rpcUrl).methods.getNativeToken([nativeWid, `0x${nativeAddress}`]).call()
    }

    /**
     * Get Everscale native token address in MultiVault by the given
     * @param {string} vaultAddress - vault address (eg. 0x00...0000)
     * @param {string} tokenAddress - token address (eg. 0x00...0000)
     * @param {string} rpcUrl
     */
    public static async getEvmMultiVaultExternalNativeToken(
        vaultAddress: string,
        tokenAddress: string,
        rpcUrl: string,
    ): Promise<string | undefined> {
        type Result = { addr: string; wid: string; }
        const result: Result = await evmMultiVaultContract(vaultAddress, rpcUrl).methods.natives(tokenAddress).call()
        return result !== undefined
            ? `${result.wid}:${new BigNumber(result.addr).toString(16).padStart(64, '0')}`
            : undefined
    }

    public static async getEvmMultiVaultAlienFees(
        vaultAddress: string,
        rpcUrl: string,
    ): Promise<{ depositFee: string, withdrawFee: string }> {
        const [depositFee, withdrawFee] = await Promise.all([
            evmMultiVaultContract(vaultAddress, rpcUrl).methods.defaultAlienDepositFee().call(),
            evmMultiVaultContract(vaultAddress, rpcUrl).methods.defaultAlienWithdrawFee().call(),
        ])
        return { depositFee, withdrawFee }
    }

    public static async getEvmMultiVaultNativeFees(
        vaultAddress: string,
        rpcUrl: string,
    ): Promise<{ depositFee: string, withdrawFee: string }> {
        const [depositFee, withdrawFee] = await Promise.all([
            evmMultiVaultContract(vaultAddress, rpcUrl).methods.defaultNativeDepositFee().call(),
            evmMultiVaultContract(vaultAddress, rpcUrl).methods.defaultNativeWithdrawFee().call(),
        ])
        return { depositFee, withdrawFee }
    }

    /**
     * Get Everscale token address in the related Vault by the given vault address
     * @param {string} vaultAddress
     * @param {string} rpcUrl
     */
    public static async getEvmVaultTokenAddress(vaultAddress: string, rpcUrl: string): Promise<string> {
        return evmVaultContract(vaultAddress, rpcUrl).methods.token().call()
    }

    public static async getEvmVaultAvailableDepositLimit(vaultAddress: string, rpcUrl: string): Promise<string> {
        return evmVaultContract(vaultAddress, rpcUrl).methods.availableDepositLimit().call()
    }

    public static async getEvmTokenBalance(
        tokenAddress: string,
        ownerAddress: string,
        rpcUrl: string,
    ): Promise<string> {
        return erc20TokenContract(tokenAddress, rpcUrl).methods.balanceOf(ownerAddress).call()
    }

    public static async getEvmTokenDecimals(tokenAddress: string, rpcUrl: string): Promise<number> {
        return parseInt((await erc20TokenContract(tokenAddress, rpcUrl).methods.decimals().call()), 10)
    }

    public static async getEvmTokenName(tokenAddress: string, rpcUrl: string): Promise<string> {
        return erc20TokenContract(tokenAddress, rpcUrl).methods.name().call()
    }

    public static async getEvmTokenSymbol(tokenAddress: string, rpcUrl: string): Promise<string> {
        return erc20TokenContract(tokenAddress, rpcUrl).methods.symbol().call()
    }

    public static async getEvmTokenTotalSupply(tokenAddress: string, rpcUrl: string): Promise<string> {
        return erc20TokenContract(tokenAddress, rpcUrl).methods.totalSupply().call()
    }

    public static async getSolanaTokenDecimals(tokenAddress: PublicKey, rpcUrl: string): Promise<number> {
        return (await getMint(new Connection(rpcUrl), tokenAddress)).decimals
    }

    public static async getAlienTokenRootMeta(
        tokenAddress: Address | string,
        state?: FullContractState,
    ): Promise<DecodedAbiFunctionOutputs<typeof MultiVaultAbi.TokenRootAlienEvm, 'meta'>> {
        return tokenRootAlienEvmContract(tokenAddress)
            .methods.meta({ answerId: 0 })
            .call({ cachedState: state })
    }

    public static async getDeriveAlienTokenRoot(
        alienProxyAddress: Address | string,
        params: Omit<DecodedAbiFunctionInputs<typeof MultiVaultAbi.AlienProxy, 'deriveEVMAlienTokenRoot'>, 'answerId'>,
        state?: FullContractState,
    ): Promise<string> {
        return (await alienProxyContract(alienProxyAddress)
            .methods.deriveEVMAlienTokenRoot({ ...params, answerId: 0 })
            .call({ cachedState: state }))
            .value0
            .toString()
    }

    public static async getMergedTokenDetails(
        tokenAddress: Address | string,
        alienProxyAddress: Address | string,
        chainId: string,
    ): Promise<MergedTokenDetails | undefined> {
        const mergeRouterAddress = (await alienProxyContract(resolveEverscaleAddress(alienProxyAddress))
            .methods.deriveMergeRouter({
                answerId: 0,
                token: resolveEverscaleAddress(tokenAddress),
            })
            .call())
            .router

        const mergePoolAddress = (await mergeRouterContract(mergeRouterAddress)
            .methods.getPool({ answerId: 0 })
            .call())
            .value0

        const mergedTokens = await mergePoolContract(mergePoolAddress)
            .methods.getTokens({ answerId: 0 })
            .call()

        const aliens = await Promise.all(mergedTokens._tokens.map(
            async ([address, settings]) => {
                if (settings.enabled) {
                    try {
                        const meta = await BridgeUtils.getAlienTokenRootMeta(address)
                        return {
                            canonicalTokenAddress: mergedTokens._canon,
                            everscaleTokenAddress: address,
                            evmTokenAddress: `0x${new BigNumber(meta.base_token)
                            .toString(16)
                            .padStart(40, '0')}`,
                            isMerged: meta.base_chainId === chainId,
                        }
                    }
                    catch (e) {
                        return { isMerged: false }
                    }
                }
                return { isMerged: false }
            },

        ))

        const merged = aliens.find(e => e.isMerged)

        return merged?.isMerged ? {
            canonicalTokenAddress: merged.canonicalTokenAddress,
            isMerged: true,
            mergeEverscaleTokenAddress: merged.everscaleTokenAddress,
            mergeEvmTokenAddress: merged.evmTokenAddress,
            mergePoolAddress,
        } : undefined
    }

    public static async getCanonicalToken(
        tokenAddress: Address | string,
        proxyAddress: Address | string,
    ): Promise<Address | undefined> {
        try {
            const mergeRouterAddress = (await alienProxyContract(proxyAddress)
                .methods.deriveMergeRouter({
                    token: resolveEverscaleAddress(tokenAddress),
                    answerId: 0,
                })
                .call())
                .router

            const mergeRouterState = await getFullContractState(mergeRouterAddress)

            if (mergeRouterState?.isDeployed) {
                const mergePoolAddress = (await mergeRouterContract(mergeRouterAddress)
                    .methods.getPool({ answerId: 0 })
                    .call())
                    .value0

                const mergePoolState = await getFullContractState(mergePoolAddress)

                if (mergePoolState?.isDeployed) {
                    return (await mergePoolContract(mergePoolAddress)
                        .methods.getCanon({ answerId: 0 })
                        .call())
                        .value0
                }
            }
            return undefined
        }
        catch (e) {
            return undefined
        }

    }

}
