import * as React from 'react'
import { useParams } from 'react-router-dom'

import { TonTransferStatus } from '@/modules/CrosschainTransfer/stores/TonTransferStatus'
import { TonTransferStatusParams } from '@/modules/CrosschainTransfer/types'
import { useTonWallet } from '@/stores/TonWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'
import { useEvmWallet } from '@/stores/EvmWalletService'


export const TonTransferStatusContext = React.createContext<TonTransferStatus>(
    new TonTransferStatus(
        useTonWallet(),
        useEvmWallet(),
        useTokensCache(),
    ),
)

export function useTonTransferStatusStore(): TonTransferStatus {
    return React.useContext(TonTransferStatusContext)
}

export function TonTransferStatusStoreProvider({ children }: React.PropsWithChildren<{}>): JSX.Element {
    const params = useParams<TonTransferStatusParams>()

    const store = React.useMemo(() => new TonTransferStatus(
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
        <TonTransferStatusContext.Provider value={store}>
            {children}
        </TonTransferStatusContext.Provider>
    )
}
