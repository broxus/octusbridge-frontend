import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmToTonSwapTransfer } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmSwapTransferContext = React.createContext<EvmToTonSwapTransfer>(
    new EvmToTonSwapTransfer(
        useEvmWallet(),
        useTonWallet(),
        useTokensCache(),
    ),
)

export function useEvmSwapTransfer(): EvmToTonSwapTransfer {
    return React.useContext(EvmSwapTransferContext)
}

type Props = {
    children: React.ReactNode;
    evmWallet: EvmWalletService,
    tonWallet: TonWalletService,
    tokensCache: TokensCacheService,
}

export function EvmSwapTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmToTonSwapTransfer(
        props.evmWallet,
        props.tonWallet,
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
