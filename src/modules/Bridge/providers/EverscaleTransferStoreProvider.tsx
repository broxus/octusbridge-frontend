import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EverscaleToEvmPipeline } from '@/modules/Bridge/stores'
import { EverscaleTransferQueryParams } from '@/modules/Bridge/types'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { isTonAddressValid } from '@/utils'


export const EverscaleTransferContext = React.createContext<EverscaleToEvmPipeline>(
    new EverscaleToEvmPipeline(
        useEverWallet(),
        useEvmWallet(),
        useTokensCache(),
    ),
)

export function useEverscaleTransfer(): EverscaleToEvmPipeline {
    return React.useContext(EverscaleTransferContext)
}


type Props = {
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
    tokensCache: TokensCacheService;
}

export function EverscaleTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EverscaleTransferQueryParams>()

    if (!isTonAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EverscaleToEvmPipeline(
        props.everWallet,
        props.evmWallet,
        props.tokensCache,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EverscaleTransferContext.Provider value={transfer}>
            {children}
        </EverscaleTransferContext.Provider>
    )
}
