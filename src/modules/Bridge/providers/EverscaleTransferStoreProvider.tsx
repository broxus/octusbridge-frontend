import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EverscaleToEvmPipeline } from '@/modules/Bridge/stores'
import { EverscaleTransferQueryParams } from '@/modules/Bridge/types'
import { BridgeAssetsService, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { isEverscaleAddressValid } from '@/utils'


export const EverscaleTransferContext = React.createContext<EverscaleToEvmPipeline>(
    new EverscaleToEvmPipeline(
        useEverWallet(),
        useEvmWallet(),
        useBridgeAssets(),
    ),
)

export function useEverscaleTransfer(): EverscaleToEvmPipeline {
    return React.useContext(EverscaleTransferContext)
}


type Props = {
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
    tokensAssets: BridgeAssetsService;
}

export function EverscaleTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EverscaleTransferQueryParams>()

    if (!isEverscaleAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EverscaleToEvmPipeline(
        props.everWallet,
        props.evmWallet,
        props.tokensAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EverscaleTransferContext.Provider value={transfer}>
            {children}
        </EverscaleTransferContext.Provider>
    )
}
