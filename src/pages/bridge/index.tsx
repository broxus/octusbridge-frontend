import * as React from 'react'
import { useIntl } from 'react-intl'

import { Bridge, CrosschainBridgeStoreProvider } from '@/modules/Bridge'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'


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
                bridgeAssets={useBridgeAssets()}
                evmWallet={useEvmWallet()}
                everWallet={useEverWallet()}
            >
                <Bridge />
            </CrosschainBridgeStoreProvider>
        </div>
    )
}
