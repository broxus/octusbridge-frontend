import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { TonTransfer } from '@/modules/Bridge/stores/TonTransfer'
import { TonTransferQueryParams } from '@/modules/Bridge/types'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'
import { isTonAddressValid } from '@/utils/is-ton-address-valid'


export const TonTransferContext = React.createContext<TonTransfer>(
    new TonTransfer(
        useTonWallet(),
        useEvmWallet(),
        useTokensCache(),
    ),
)

export function useTonTransferStore(): TonTransfer {
    return React.useContext(TonTransferContext)
}

export function TonTransferStoreProvider({ children }: React.PropsWithChildren<{}>): JSX.Element {
    const params = useParams<TonTransferQueryParams>()

    if (!isTonAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const store = React.useMemo(() => new TonTransfer(
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
        <TonTransferContext.Provider value={store}>
            {children}
        </TonTransferContext.Provider>
    )
}
