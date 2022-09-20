import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmEverscaleCreditPipeline } from '@/modules/Bridge/stores'
import type { EvmTransferUrlParams } from '@/modules/Bridge/types'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import type { BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import type { EverWalletService } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import type { EvmWalletService } from '@/stores/EvmWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmEverscaleCreditPipelineContext = React.createContext<EvmEverscaleCreditPipeline>(
    new EvmEverscaleCreditPipeline(
        useEvmWallet(),
        useEverWallet(),
        useBridgeAssets(),
    ),
)

export function useEvmEverscaleCreditPipelineContext(): EvmEverscaleCreditPipeline {
    return React.useContext(EvmEverscaleCreditPipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}

export function EvmEverscaleCreditPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferUrlParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmEverscaleCreditPipeline(
        props.evmWallet,
        props.everWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmEverscaleCreditPipelineContext.Provider value={transfer}>
            {children}
        </EvmEverscaleCreditPipelineContext.Provider>
    )
}
