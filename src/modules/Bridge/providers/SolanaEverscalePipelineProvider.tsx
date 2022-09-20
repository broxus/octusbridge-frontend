import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { SolanaEverscalePipeline } from '@/modules/Bridge/stores/SolanaEverscalePipeline'
import type { SolanaTransferUrlParams } from '@/modules/Bridge/types'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import type { BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import type { EverWalletService } from '@/stores/EverWalletService'
import { useSolanaWallet } from '@/stores/SolanaWalletService'
import type { SolanaWalletService } from '@/stores/SolanaWalletService'
import { isSolanaTxSignatureValid } from '@/utils'


export const SolanaEverscalePipelineContext = React.createContext<SolanaEverscalePipeline>(
    new SolanaEverscalePipeline(
        useSolanaWallet(),
        useEverWallet(),
        useBridgeAssets(),
    ),
)

export function useSolanaEverscalePipelineContext(): SolanaEverscalePipeline {
    return React.useContext(SolanaEverscalePipelineContext)
}

type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    solanaWallet: SolanaWalletService;
}

export function SolanaEverscalePipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<SolanaTransferUrlParams>()

    if (!isSolanaTxSignatureValid(params.txSignature)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new SolanaEverscalePipeline(
        props.solanaWallet,
        props.everWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <SolanaEverscalePipelineContext.Provider value={transfer}>
            {children}
        </SolanaEverscalePipelineContext.Provider>
    )
}
