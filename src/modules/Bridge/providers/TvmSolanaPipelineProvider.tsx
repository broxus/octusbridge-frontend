import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { TvmSolanaPipeline } from '@/modules/Bridge/stores'
import { type TvmTransferUrlParams } from '@/modules/Bridge/types'
import { type BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { type EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { type SolanaWalletService, useSolanaWallet } from '@/stores/SolanaWalletService'
import { isEverscaleAddressValid } from '@/utils'

export const TvmSolanaPipelineContext = React.createContext<TvmSolanaPipeline>(
    new TvmSolanaPipeline(useEverWallet(), useSolanaWallet(), useBridgeAssets()),
)

export function useTvmSolanaPipelineContext(): TvmSolanaPipeline {
    return React.useContext(TvmSolanaPipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService
    children: React.ReactNode
    everWallet: EverWalletService
    solanaWallet: SolanaWalletService
}

export function TvmSolanaPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<TvmTransferUrlParams>()

    if (!isEverscaleAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(
        () => new TvmSolanaPipeline(props.everWallet, props.solanaWallet, props.bridgeAssets, params),
        [params],
    )

    useTransferLifecycle(transfer)

    return (
        <TvmSolanaPipelineContext.Provider value={transfer}>{children}</TvmSolanaPipelineContext.Provider>
    )
}
