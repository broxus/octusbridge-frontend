import * as React from 'react'
import { reaction } from 'mobx'
import { useHistory } from 'react-router-dom'

import { useSummary } from '@/modules/Bridge/providers/BridgeTransferSummaryProvider'
import { CrosschainBridge } from '@/modules/Bridge/stores'
import { transferStatusStorageKey } from '@/modules/Bridge/utils'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { SolanaWalletService, useSolanaWallet } from '@/stores/SolanaWalletService'
import { getAssociatedNetwork, storage } from '@/utils'

export const CrosschainBridgeStoreContext = React.createContext<CrosschainBridge>(new CrosschainBridge(
    useEvmWallet(),
    useEverWallet(),
    useSolanaWallet(),
    useBridgeAssets(),
))

export function useBridge(): CrosschainBridge {
    return React.useContext(CrosschainBridgeStoreContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
    solanaWallet: SolanaWalletService;
}


export function CrosschainBridgeStoreProvider({ children, ...props }: Props): JSX.Element {
    const history = useHistory()

    const bridge = React.useMemo(() => new CrosschainBridge(
        props.evmWallet,
        props.everWallet,
        props.solanaWallet,
        props.bridgeAssets,
    ), [
        props.evmWallet,
        props.everWallet,
        props.solanaWallet,
        props.bridgeAssets,
    ])

    const summary = useSummary()

    React.useEffect(() => bridge.init(), [])

    React.useEffect(() => {
        summary.reset()

        const summaryDisposer = reaction(
            () => ({
                amount: bridge.amount,
                depositFee: bridge.depositFee,
                eversAmount: bridge.eversAmount,
                everscaleEvmCost: bridge.everscaleEvmCost,
                evmEverscaleCost: bridge.evmEverscaleCost,
                gasPrice: bridge.gasPrice,
                hiddenBridgePipeline: bridge.hiddenBridgePipeline,
                leftAddress: bridge.leftAddress,
                leftNetwork: bridge.leftNetwork,
                maxTransferFee: bridge.maxTransferFee,
                minTransferFee: bridge.minTransferFee,
                pipeline: bridge.pipeline,
                rightAddress: bridge.rightAddress,
                rightNetwork: bridge.rightNetwork,
                token: bridge.token,
                withdrawFee: bridge.withdrawFee,
                pendingWithdrawals: bridge.pendingWithdrawals,
            }),
            data => {
                summary.setData(data)
            },
        )

        const redirectDisposer = reaction(() => bridge.txHash, value => {
            if (
                value === undefined
                || bridge.leftNetwork?.type === undefined
                || bridge.leftNetwork.chainId === undefined
                || bridge.rightNetwork?.type === undefined
                || bridge.rightNetwork.chainId === undefined
            ) {
                return
            }

            summary.setData('txAddress', value)

            summaryDisposer()

            const leftNetworkType = getAssociatedNetwork(bridge.leftNetwork.type)
            const rightNetworkType = getAssociatedNetwork(bridge.rightNetwork.type)

            const leftNetwork = `${leftNetworkType}-${bridge.leftNetwork.chainId}`
            const rightNetwork = `${rightNetworkType}-${bridge.rightNetwork?.chainId}`

            const storageKey = transferStatusStorageKey(
                bridge.leftNetwork.type,
                bridge.leftNetwork.chainId,
                bridge.rightNetwork.type,
                bridge.rightNetwork.chainId,
                value,
            )
            storage.set(storageKey, '1')

            bridge.dispose()
            history.push(`/transfer/${leftNetwork}/${rightNetwork}/${value}`)
        })

        return () => {
            summaryDisposer()
            redirectDisposer()
        }
    }, [bridge, summary])

    return (
        <CrosschainBridgeStoreContext.Provider value={bridge}>
            {children}
        </CrosschainBridgeStoreContext.Provider>
    )
}
