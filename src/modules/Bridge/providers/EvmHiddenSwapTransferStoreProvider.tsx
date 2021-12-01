import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmToEvmHiddenSwapTransfer } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmHiddenSwapTransferContext = React.createContext<EvmToEvmHiddenSwapTransfer>(
    new EvmToEvmHiddenSwapTransfer(
        useEvmWallet(),
        useTonWallet(),
        useTokensCache(),
    ),
)

export function useEvmHiddenSwapTransfer(): EvmToEvmHiddenSwapTransfer {
    return React.useContext(EvmHiddenSwapTransferContext)
}

type Props = {
    children: React.ReactNode;
    evmWallet: EvmWalletService,
    tonWallet: TonWalletService,
    tokensCache: TokensCacheService,
}

export function EvmHiddenSwapTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmToEvmHiddenSwapTransfer(
        props.evmWallet,
        props.tonWallet,
        props.tokensCache,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmHiddenSwapTransferContext.Provider value={transfer}>
            {children}
        </EvmHiddenSwapTransferContext.Provider>
    )
}
