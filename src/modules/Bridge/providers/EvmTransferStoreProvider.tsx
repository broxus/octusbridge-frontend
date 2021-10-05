import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { EvmTransfer } from '@/modules/Bridge/stores/EvmTransfer'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'
import { useTonWallet } from '@/stores/TonWalletService'
import { isEvmTxHashValid } from '@/utils'


export const EvmTransferContext = React.createContext<EvmTransfer>(
    new EvmTransfer(
        useEvmWallet(),
        useTonWallet(),
        useTokensCache(),
    ),
)

export function useEvmTransferStoreContext(): EvmTransfer {
    return React.useContext(EvmTransferContext)
}

export function EvmTransferStoreProvider({ children }: React.PropsWithChildren<{}>): JSX.Element {
    const params = useParams<EvmTransferQueryParams>()

    if (!isEvmTxHashValid(params.txHash)) {
        return <Redirect to="/bridge" />
    }

    const store = React.useMemo(() => new EvmTransfer(
        useEvmWallet(),
        useTonWallet(),
        useTokensCache(),
        params,
    ), [params])

    React.useEffect(() => {
        (async () => {
            try {
                await store.init()
            }
            catch (e) {}
        })()
        return () => store.dispose()
    }, [params])

    return (
        <EvmTransferContext.Provider value={store}>
            {children}
        </EvmTransferContext.Provider>
    )
}
