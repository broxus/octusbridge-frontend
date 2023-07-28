import { reaction } from 'mobx'
import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { useSummary } from '@/modules/Bridge/providers/BridgeTransferSummaryProvider'
import { CrosschainBridge } from '@/modules/Bridge/stores'
import { type BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { type EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { type EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { type SolanaWalletService, useSolanaWallet } from '@/stores/SolanaWalletService'
import { getAssociatedNetwork } from '@/utils'

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

    React.useEffect(() => reaction(
        () => ({
            amount: bridge.amount,
            depositFee: bridge.depositFee,
            evmTvmCost: bridge.evmTvmCost,
            expectedEversAmount: bridge.expectedEversAmount,
            gasPrice: bridge.gasPrice,
            leftAddress: bridge.leftAddress,
            leftNetwork: bridge.leftNetwork,
            maxTransferFee: bridge.maxTransferFee,
            minTransferFee: bridge.minTransferFee,
            pendingWithdrawals: bridge.pendingWithdrawals,
            pipeline: bridge.pipeline,
            rightAddress: bridge.rightAddress,
            rightNetwork: bridge.rightNetwork,
            secondDepositFee: bridge.secondDepositFee,
            secondPipeline: bridge.secondPipeline,
            secondWithdrawFee: bridge.secondWithdrawFee,
            token: bridge.token,
            tvmEvmCost: bridge.tvmEvmCost,
            withdrawFee: bridge.withdrawFee,
        }),
        data => {
            summary.setData(data)
        },
    ), [])

    React.useEffect(() => reaction(() => bridge.txHash, value => {
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

            const leftNetworkType = getAssociatedNetwork(bridge.leftNetwork.type)
            const rightNetworkType = getAssociatedNetwork(bridge.rightNetwork.type)

            const leftNetwork = `${leftNetworkType}-${bridge.leftNetwork.chainId}`
            const rightNetwork = `${rightNetworkType}-${bridge.rightNetwork?.chainId}`

            bridge.dispose()
            history.push(`/transfer/${leftNetwork}/${rightNetwork}/${value}`)
        }), [bridge, summary])

    return (
        <CrosschainBridgeStoreContext.Provider value={bridge}>
            {children}
        </CrosschainBridgeStoreContext.Provider>
    )
}
