import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmToEvmHiddenSwapPipeline } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { isEvmTxHashValid } from '@/utils'


export const EvmHiddenSwapTransferContext = React.createContext<EvmToEvmHiddenSwapPipeline>(
    new EvmToEvmHiddenSwapPipeline(
        useEvmWallet(),
        useEverWallet(),
        useBridgeAssets(),
    ),
)

export function useEvmHiddenSwapTransfer(): EvmToEvmHiddenSwapPipeline {
    return React.useContext(EvmHiddenSwapTransferContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}

export function EvmHiddenSwapTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmToEvmHiddenSwapPipeline(
        props.evmWallet,
        props.everWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmHiddenSwapTransferContext.Provider value={transfer}>
            {children}
        </EvmHiddenSwapTransferContext.Provider>
    )
}
