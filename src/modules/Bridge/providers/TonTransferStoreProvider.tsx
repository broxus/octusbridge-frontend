import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { TonToEvmTransfer } from '@/modules/Bridge/stores'
import { TonTransferQueryParams } from '@/modules/Bridge/types'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { isTonAddressValid } from '@/utils'


export const TonTransferContext = React.createContext<TonToEvmTransfer>(
    new TonToEvmTransfer(
        useTonWallet(),
        useEvmWallet(),
        useTokensCache(),
    ),
)

export function useTonTransfer(): TonToEvmTransfer {
    return React.useContext(TonTransferContext)
}

type Props = {
    children: React.ReactNode;
    evmWallet: EvmWalletService,
    tonWallet: TonWalletService,
    tokensCache: TokensCacheService,
}

export function TonTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<TonTransferQueryParams>()

    if (!isTonAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new TonToEvmTransfer(
        props.tonWallet,
        props.evmWallet,
        props.tokensCache,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <TonTransferContext.Provider value={transfer}>
            {children}
        </TonTransferContext.Provider>
    )
}
