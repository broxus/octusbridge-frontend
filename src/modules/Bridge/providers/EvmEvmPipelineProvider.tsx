import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmEvmPipeline } from '@/modules/Bridge/stores'
import { type EvmTransferUrlParams } from '@/modules/Bridge/types'
import { type BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { type EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { type EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { isEvmTxHashValid } from '@/utils'

export const EvmEvmPipelineContext = React.createContext<EvmEvmPipeline>(
    new EvmEvmPipeline(
        useEvmWallet(),
        useBridgeAssets(),
        useEverWallet(),
    ),
)

export function useEvmEvmPipelineContext(): EvmEvmPipeline {
    return React.useContext(EvmEvmPipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}

export function EvmEvmPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferUrlParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmEvmPipeline(
        props.evmWallet,
        props.bridgeAssets,
        props.everWallet,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmEvmPipelineContext.Provider value={transfer}>
            {children}
        </EvmEvmPipelineContext.Provider>
    )
}
