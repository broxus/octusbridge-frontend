import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmToTonTransfer } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmTransferContext = React.createContext<EvmToTonTransfer>(
    new EvmToTonTransfer(
        useEvmWallet(),
        useTonWallet(),
        useTokensCache(),
    ),
)

export function useEvmTransfer(): EvmToTonTransfer {
    return React.useContext(EvmTransferContext)
}

type Props = {
    children: React.ReactNode;
    evmWallet: EvmWalletService,
    tonWallet: TonWalletService,
    tokensCache: TokensCacheService,
}

export function EvmTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmToTonTransfer(
        props.evmWallet,
        props.tonWallet,
        props.tokensCache,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmTransferContext.Provider value={transfer}>
            {children}
        </EvmTransferContext.Provider>
    )
}
