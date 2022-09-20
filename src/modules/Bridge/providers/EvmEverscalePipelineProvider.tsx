import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmEverscalePipeline } from '@/modules/Bridge/stores'
import { EvmTransferUrlParams } from '@/modules/Bridge/types'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmEverscalePipelineContext = React.createContext<EvmEverscalePipeline>(
    new EvmEverscalePipeline(
        useEvmWallet(),
        useEverWallet(),
        useBridgeAssets(),
    ),
)

export function useEvmEverscalePipelineContext(): EvmEverscalePipeline {
    return React.useContext(EvmEverscalePipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}

export function EvmEverscalePipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferUrlParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmEverscalePipeline(
        props.evmWallet,
        props.everWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmEverscalePipelineContext.Provider value={transfer}>
            {children}
        </EvmEverscalePipelineContext.Provider>
    )
}
