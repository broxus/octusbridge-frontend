import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmTvmPipeline } from '@/modules/Bridge/stores'
import { type EvmTransferUrlParams } from '@/modules/Bridge/types'
import { type BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { type EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { type EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { isEvmTxHashValid } from '@/utils'

export const EvmTvmPipelineContext = React.createContext<EvmTvmPipeline>(
    new EvmTvmPipeline(useEvmWallet(), useEverWallet(), useBridgeAssets()),
)

export function useEvmTvmPipelineContext(): EvmTvmPipeline {
    return React.useContext(EvmTvmPipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService
    children: React.ReactNode
    evmWallet: EvmWalletService
    tvmWallet: EverWalletService
}

export function EvmTvmPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferUrlParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(
        () => new EvmTvmPipeline(props.evmWallet, props.tvmWallet, props.bridgeAssets, params),
        [params],
    )

    useTransferLifecycle(transfer)

    return <EvmTvmPipelineContext.Provider value={transfer}>{children}</EvmTvmPipelineContext.Provider>
}
