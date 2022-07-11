import * as React from 'react'
import { reaction } from 'mobx'
import { useHistory } from 'react-router-dom'

import { CrosschainBridge, TransferSummary } from '@/modules/Bridge/stores'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'

export type CrosschainBridgeContextConsumerProps = {
    bridge: CrosschainBridge;
    summary: TransferSummary;
}

export const CrosschainBridgeStoreContext = React.createContext<CrosschainBridgeContextConsumerProps>({
    bridge: new CrosschainBridge(
        useEvmWallet(),
        useEverWallet(),
        useBridgeAssets(),
    ),
    summary: new TransferSummary(useBridgeAssets()),
})

export function useBridge(): CrosschainBridgeContextConsumerProps {
    return React.useContext(CrosschainBridgeStoreContext)
}


type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}


export function CrosschainBridgeStoreProvider({ children, ...props }: Props): JSX.Element {
    const history = useHistory()

    const bridge = React.useMemo(() => new CrosschainBridge(
        props.evmWallet,
        props.everWallet,
        props.bridgeAssets,
    ), [])

    const summary = React.useMemo(() => new TransferSummary(bridge.useBridgeAssets), [bridge.useBridgeAssets])

    const context = React.useMemo(() => ({ bridge, summary }), [bridge, summary])

    React.useEffect(() => {
        bridge.init()
        summary.reset()

        const redirectDisposer = reaction(() => bridge.txHash, value => {
            if (value === undefined) {
                return
            }

            const leftNetwork = `${bridge.leftNetwork?.type}-${bridge.leftNetwork?.chainId}`
            const rightNetwork = `${bridge.rightNetwork?.type}-${bridge.rightNetwork?.chainId}`
            const depositType = bridge.isEverscaleToEvm ? '' : `/${bridge.depositType || 'default'}`

            history.push(`/transfer/${leftNetwork}/${rightNetwork}/${value}${depositType}`)
        })

        const summaryDisposer = reaction(
            () => ({
                amount: bridge.amountNumber
                    .shiftedBy(bridge.isFromEverscale
                        ? (bridge.token?.decimals || 0)
                        : (bridge.pipeline?.evmTokenDecimals || 0))
                    .toFixed(),
                depositFee: bridge.depositFee,
                depositType: bridge.depositType,
                hiddenBridgePipeline: bridge.hiddenBridgePipeline,
                leftAddress: bridge.leftAddress,
                leftNetwork: bridge.leftNetwork,
                maxTransferFee: bridge.maxTransferFee,
                minTransferFee: bridge.minTransferFee,
                pipeline: bridge.pipeline,
                rightAddress: bridge.rightAddress,
                rightNetwork: bridge.rightNetwork,
                token: bridge.token,
                tokenAmount: bridge.tokenAmountNumber
                    .shiftedBy(bridge.token?.decimals || 0)
                    .toFixed(),
                withdrawFee: bridge.withdrawFee,
                pendingWithdrawals: bridge.pendingWithdrawals,
            }),
            data => {
                summary.setData(data)
            },
        )

        return () => {
            redirectDisposer()
            summaryDisposer()
            bridge.dispose()
            summary.reset()
        }
    }, [bridge, summary])

    return (
        <CrosschainBridgeStoreContext.Provider value={context}>
            {children}
        </CrosschainBridgeStoreContext.Provider>
    )
}
