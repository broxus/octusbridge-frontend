import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EverscaleSolanaPipeline } from '@/modules/Bridge/stores'
import { EverscaleTransferUrlParams } from '@/modules/Bridge/types'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { SolanaWalletService, useSolanaWallet } from '@/stores/SolanaWalletService'
import { isEverscaleAddressValid } from '@/utils'


export const EverscaleSolanaPipelineContext = React.createContext<EverscaleSolanaPipeline>(
    new EverscaleSolanaPipeline(
        useEverWallet(),
        useSolanaWallet(),
        useBridgeAssets(),
    ),
)

export function useEverscaleSolanaPipelineContext(): EverscaleSolanaPipeline {
    return React.useContext(EverscaleSolanaPipelineContext)
}


type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    solanaWallet: SolanaWalletService;
}

export function EverscaleSolanaPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EverscaleTransferUrlParams>()

    if (!isEverscaleAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EverscaleSolanaPipeline(
        props.everWallet,
        props.solanaWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EverscaleSolanaPipelineContext.Provider value={transfer}>
            {children}
        </EverscaleSolanaPipelineContext.Provider>
    )
}
