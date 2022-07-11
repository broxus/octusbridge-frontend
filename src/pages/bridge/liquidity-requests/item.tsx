import * as React from 'react'
import { useIntl } from 'react-intl'
import { useLocation, useParams } from 'react-router-dom'

import { Bridge, CrosschainBridgeStoreProvider } from '@/modules/Bridge'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'

export default function Page(): JSX.Element {
    const intl = useIntl()
    const params = useParams<any>()
    const location = useLocation()

    const evmPendingWithdrawal = {
        chainId: params.chainId,
        evmTokenAddress: params.evmTokenAddress,
        withdrawalIds: new URLSearchParams(location.search)
            .getAll('id')
            .map(item => ({
                recipient: item.split('.')[0],
                id: item.split('.')[1],
            })),
    }

    return (
        <div className="container container--large">
            <header className="page-header">
                <h1 className="page-title">
                    {intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_FORM_TITLE',
                    })}
                </h1>
            </header>

            <CrosschainBridgeStoreProvider
                evmWallet={useEvmWallet()}
                everWallet={useEverWallet()}
                bridgeAssets={useBridgeAssets()}
            >
                <Bridge
                    evmPendingWithdrawal={evmPendingWithdrawal}
                />
            </CrosschainBridgeStoreProvider>
        </div>
    )
}
