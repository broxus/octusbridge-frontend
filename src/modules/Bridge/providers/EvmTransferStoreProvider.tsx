import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { useTransferLifecycle } from '@/modules/Bridge/hooks'
import { EvmToEverscalePipeline } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokensAssetsService, useTokensAssets } from '@/stores/TokensAssetsService'
import { isEvmTxHashValid } from '@/utils'


export const EvmTransferContext = React.createContext<EvmToEverscalePipeline>(
    new EvmToEverscalePipeline(
        useEvmWallet(),
        useEverWallet(),
        useTokensAssets(),
    ),
)

export function useEvmTransfer(): EvmToEverscalePipeline {
    return React.useContext(EvmTransferContext)
}

type Props = {
    children: React.ReactNode;
    everWallet: EverWalletService;
    evmWallet: EvmWalletService;
    tokensAssets: TokensAssetsService;
}

export function EvmTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new EvmToEverscalePipeline(
        props.evmWallet,
        props.everWallet,
        props.tokensAssets,
        params,
    ), [params])

    useTransferLifecycle(transfer)

    return (
        <EvmTransferContext.Provider value={transfer}>
            {children}
        </EvmTransferContext.Provider>
    )
}
