import * as React from 'react'
import { reaction } from 'mobx'
import { useHistory } from 'react-router-dom'

import { CrosschainBridge } from '@/modules/Bridge/stores/CrosschainBridge'
import { useSummary } from '@/modules/Bridge/stores/TransferSummary'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'


export const CrosschainBridgeStoreContext = React.createContext<CrosschainBridge>(
    new CrosschainBridge(
        useEvmWallet(),
        useTonWallet(),
        useTokensCache(),
    ),
)

export function useBridge(): CrosschainBridge {
    return React.useContext(CrosschainBridgeStoreContext)
}


type Props = {
    children: React.ReactNode;
    evmWallet: EvmWalletService,
    tonWallet: TonWalletService,
    tokensCache: TokensCacheService,
}


export function CrosschainBridgeStoreProvider({ children, ...props }: Props): JSX.Element {
    const history = useHistory()
    const summary = useSummary()

    const bridge = React.useMemo(() => new CrosschainBridge(
        props.evmWallet,
        props.tonWallet,
        props.tokensCache,
    ), [])

    React.useEffect(() => {
        bridge.init()
        summary.clean()

        const redirectDisposer = reaction(() => bridge.txHash, value => {
            if (value === undefined) {
                return
            }

            const leftNetwork = `${bridge.leftNetwork?.type}-${bridge.leftNetwork?.chainId}`
            const rightNetwork = `${bridge.rightNetwork?.type}-${bridge.rightNetwork?.chainId}`

            history.push(`/transfer/${leftNetwork}/${rightNetwork}/${value}/${bridge.depositType || 'default'}`)
        })

        const summaryDisposer = reaction(
            () => ({
                amount: bridge.amount,
                leftAddress: bridge.leftAddress,
                leftNetwork: bridge.leftNetwork,
                rightAddress: bridge.rightAddress,
                rightNetwork: bridge.rightNetwork,
                token: bridge.token,
            }),
            data => {
                summary.update(data)
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
