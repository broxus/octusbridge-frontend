import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { TvmEvmPipeline } from '@/modules/Bridge/stores'
import { type TvmTransferUrlParams } from '@/modules/Bridge/types'
import { type BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { type EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { type EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { isEverscaleAddressValid } from '@/utils'

export const TvmEvmPipelineContext = React.createContext<TvmEvmPipeline>(
    new TvmEvmPipeline(useEverWallet(), useEvmWallet(), useBridgeAssets()),
)

export function useTvmEvmPipelineContext(): TvmEvmPipeline {
    return React.useContext(TvmEvmPipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService
    children: React.ReactNode
    everWallet: EverWalletService
    evmWallet: EvmWalletService
}

export function TvmEvmPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<TvmTransferUrlParams>()

    if (!isEverscaleAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(
        () => new TvmEvmPipeline(props.everWallet, props.evmWallet, props.bridgeAssets, params),
        [params],
    )

    useTransferLifecycle(transfer)

    return <TvmEvmPipelineContext.Provider value={transfer}>{children}</TvmEvmPipelineContext.Provider>
}
