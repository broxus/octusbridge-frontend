import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmEvmHiddenBridgePipeline } from '@/modules/Bridge/stores'
import type { EvmTransferUrlParams } from '@/modules/Bridge/types'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import type { BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import type { EverWalletService } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import type { EvmWalletService } from '@/stores/EvmWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmEvmHiddenBridgePipelineContext = React.createContext<EvmEvmHiddenBridgePipeline>(
    new EvmEvmHiddenBridgePipeline(
        useEvmWallet(),
        useEverWallet(),
        useBridgeAssets(),
    ),
)

export function useEvmEvmHiddenBridgePipelineContext(): EvmEvmHiddenBridgePipeline {
    return React.useContext(EvmEvmHiddenBridgePipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}

export function EvmEvmHiddenBridgePipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferUrlParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmEvmHiddenBridgePipeline(
        props.evmWallet,
        props.everWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmEvmHiddenBridgePipelineContext.Provider value={transfer}>
            {children}
        </EvmEvmHiddenBridgePipelineContext.Provider>
    )
}
