import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EverscaleEvmPipeline } from '@/modules/Bridge/stores'
import { EverscaleTransferUrlParams } from '@/modules/Bridge/types'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { isEverscaleAddressValid } from '@/utils'


export const EverscaleEvmPipelineContext = React.createContext<EverscaleEvmPipeline>(
    new EverscaleEvmPipeline(
        useEverWallet(),
        useEvmWallet(),
        useBridgeAssets(),
    ),
)

export function useEverscaleEvmPipelineContext(): EverscaleEvmPipeline {
    return React.useContext(EverscaleEvmPipelineContext)
}


type Props = {
    bridgeAssets: BridgeAssetsService;
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
}

export function EverscaleEvmPipelineProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EverscaleTransferUrlParams>()

    if (!isEverscaleAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EverscaleEvmPipeline(
        props.everWallet,
        props.evmWallet,
        props.bridgeAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EverscaleEvmPipelineContext.Provider value={transfer}>
            {children}
        </EverscaleEvmPipelineContext.Provider>
    )
}
