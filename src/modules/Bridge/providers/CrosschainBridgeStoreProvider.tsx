import * as React from 'react'
import { reaction } from 'mobx'
import { useHistory } from 'react-router-dom'

import { CrosschainBridge, useSummary } from '@/modules/Bridge/stores'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensAssetsService, useTokensAssets } from '@/stores/TokensAssetsService'


export const CrosschainBridgeStoreContext = React.createContext<CrosschainBridge>(
    new CrosschainBridge(
        useEvmWallet(),
        useEverWallet(),
        useTokensAssets(),
    ),
)

export function useBridge(): CrosschainBridge {
    return React.useContext(CrosschainBridgeStoreContext)
}


type Props = {
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
    tokensAssets: TokensAssetsService;
}


export function CrosschainBridgeStoreProvider({ children, ...props }: Props): JSX.Element {
    const history = useHistory()
    const summary = useSummary()

    const bridge = React.useMemo(() => new CrosschainBridge(
        props.evmWallet,
        props.everWallet,
        props.tokensAssets,
    ), [])

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
                depositType: bridge.depositType,
                leftAddress: bridge.leftAddress,
                leftNetwork: bridge.leftNetwork,
                maxTransferFee: bridge.maxTransferFee,
                minTransferFee: bridge.minTransferFee,
                rightAddress: bridge.rightAddress,
                rightNetwork: bridge.rightNetwork,
                token: bridge.token,
                tokenAmount: bridge.tokenAmountNumber
                    .shiftedBy(bridge.token?.decimals || 0)
                    .toFixed(),
            }),
            data => {
                summary.setData(data)
            },
        )

        return () => {
            redirectDisposer()
            summaryDisposer()
            bridge.dispose()
        }
    }, [])

    return (
        <CrosschainBridgeStoreContext.Provider value={bridge}>
            {children}
        </CrosschainBridgeStoreContext.Provider>
    )
}
