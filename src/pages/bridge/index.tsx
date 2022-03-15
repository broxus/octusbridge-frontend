import * as React from 'react'
import { useIntl } from 'react-intl'

import { Bridge, CrosschainBridgeStoreProvider } from '@/modules/Bridge'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'
import { useEverWallet } from '@/stores/EverWalletService'


export default function Page(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <header className="page-header">
                <h1 className="page-title">
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                    })}
                </h1>
            </header>

            <CrosschainBridgeStoreProvider
                evmWallet={useEvmWallet()}
                everWallet={useEverWallet()}
                tokensCache={useTokensCache()}
            >
                <Bridge />
            </CrosschainBridgeStoreProvider>
        </div>
    )
}
