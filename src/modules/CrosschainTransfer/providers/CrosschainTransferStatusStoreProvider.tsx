import * as React from 'react'
import { useParams } from 'react-router-dom'

import { CrosschainStatus } from '@/modules/CrosschainTransfer/stores/CrosschainStatus'
import { useCrystalWallet } from '@/stores/CrystalWalletService'
import { useTonTokensCache } from '@/stores/TonTokensCacheService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useEvmTokensCache } from '@/stores/EvmTokensCacheService'


export type CrosschainTransferStatusParams = {
    fromId: string;
    fromType: string;
    toId: string;
    toType: string;
    txHash: string;
}

export const Context = React.createContext<CrosschainStatus>(
    new CrosschainStatus(
        useCrystalWallet(),
        useTonTokensCache(),
        useEvmWallet(),
        useEvmTokensCache(),
    ),
)

export function useCrosschainTransferStatusStore(): CrosschainStatus {
    return React.useContext(Context)
}

export function CrosschainTransferStatusStoreProvider({ children }: React.PropsWithChildren<{}>): JSX.Element {
    const params = useParams<CrosschainTransferStatusParams>()

    const store = React.useMemo(() => new CrosschainStatus(
        useCrystalWallet(),
        useTonTokensCache(),
        useEvmWallet(),
        useEvmTokensCache(),
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
        <Context.Provider value={store}>
            {children}
        </Context.Provider>
    )
}
