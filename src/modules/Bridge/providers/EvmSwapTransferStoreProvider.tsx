import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmToEverscaleSwapPipeline } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { isEvmTxHashValid } from '@/utils'


export const EvmSwapTransferContext = React.createContext<EvmToEverscaleSwapPipeline>(
    new EvmToEverscaleSwapPipeline(
        useEvmWallet(),
        useEverWallet(),
        useTokensCache(),
    ),
)

export function useEvmSwapTransfer(): EvmToEverscaleSwapPipeline {
    return React.useContext(EvmSwapTransferContext)
}

type Props = {
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
    tokensCache: TokensCacheService;
}

export function EvmSwapTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmToEverscaleSwapPipeline(
        props.evmWallet,
        props.everWallet,
        props.tokensCache,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmSwapTransferContext.Provider value={transfer}>
            {children}
        </EvmSwapTransferContext.Provider>
    )
}
