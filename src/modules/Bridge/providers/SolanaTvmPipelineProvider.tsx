import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { SolanaTvmPipeline } from '@/modules/Bridge/stores/SolanaTvmPipeline'
import { type SolanaTransferUrlParams } from '@/modules/Bridge/types'
import { type BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { type EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { type SolanaWalletService, useSolanaWallet } from '@/stores/SolanaWalletService'
import { isSolanaTxSignatureValid } from '@/utils'

export const SolanaTvmPipelineContext = React.createContext<SolanaTvmPipeline>(
    new SolanaTvmPipeline(useSolanaWallet(), useEverWallet(), useBridgeAssets()),
)

export function useSolanaTvmPipelineContext(): SolanaTvmPipeline {
    return React.useContext(SolanaTvmPipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService
    children: React.ReactNode
    everWallet: EverWalletService
    solanaWallet: SolanaWalletService
}

export function SolanaTvmPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<SolanaTransferUrlParams>()

    if (!isSolanaTxSignatureValid(params.txSignature)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(
        () => new SolanaTvmPipeline(props.solanaWallet, props.everWallet, props.bridgeAssets, params),
        [params],
    )

    useTransferLifecycle(transfer)

    return (
        <SolanaTvmPipelineContext.Provider value={transfer}>{children}</SolanaTvmPipelineContext.Provider>
    )
}
