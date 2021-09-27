import * as React from 'react'
import { useParams } from 'react-router-dom'

import { EvmTransferStatus } from '@/modules/CrosschainTransfer/stores/EvmTransferStatus'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'
import { useTonWallet } from '@/stores/TonWalletService'
import { EvmTransferStatusParams } from '@/modules/CrosschainTransfer/types'


export const EvmTransferStatusContext = React.createContext<EvmTransferStatus>(
    new EvmTransferStatus(
        useTonWallet(),
        useEvmWallet(),
        useTokensCache(),
    ),
)

export function useEvmTransferStatusStore(): EvmTransferStatus {
    return React.useContext(EvmTransferStatusContext)
}

export function EvmTransferStatusStoreProvider({ children }: React.PropsWithChildren<{}>): JSX.Element {
    const params = useParams<EvmTransferStatusParams>()

    const store = React.useMemo(() => new EvmTransferStatus(
        useTonWallet(),
        useEvmWallet(),
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
        <EvmTransferStatusContext.Provider value={store}>
            {children}
        </EvmTransferStatusContext.Provider>
    )
}
