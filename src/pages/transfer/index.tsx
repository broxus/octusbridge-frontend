import * as React from 'react'
import { useIntl } from 'react-intl'
import { Redirect, useParams } from 'react-router-dom'

import {
    EverscaleToEvm,
    EverscaleTransferStoreProvider,
    EvmHiddenSwapTransferStoreProvider,
    EvmSwapTransferStoreProvider,
    EvmToEverscale,
    EvmToEverscaleSwap,
    EvmToEvmHiddenSwap,
    EvmTransferStoreProvider,
} from '@/modules/Bridge'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTokensAssets } from '@/stores/TokensAssetsService'


export default function Page(): JSX.Element | null {
    const intl = useIntl()
    const params = useParams<EvmTransferQueryParams>()

    switch (`${params.fromType}-${params.toType}`) {
        case 'evm-ton':
            return (
                <Redirect
                    to={`/transfer/evm-${params.fromId}/everscale-${params.toId}/${params.txHash}/${params.depositType}`}
                />
            )

        case 'ton-evm': {
            return (
                <Redirect
                    to={`/transfer/everscale-${params.fromId}/evm-${params.toId}/${params.txHash}/${params.depositType}`}
                />
            )
        }

        case 'evm-everscale':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    {params.depositType === 'credit' ? (
                        <EvmSwapTransferStoreProvider
                            evmWallet={useEvmWallet()}
                            everWallet={useEverWallet()}
                            tokensAssets={useTokensAssets()}
                        >
                            <EvmToEverscaleSwap />
                        </EvmSwapTransferStoreProvider>
                    ) : (
                        <EvmTransferStoreProvider
                            evmWallet={useEvmWallet()}
                            everWallet={useEverWallet()}
                            tokensAssets={useTokensAssets()}
                        >
                            <EvmToEverscale />
                        </EvmTransferStoreProvider>
                    )}
                </div>
            )

        case 'evm-evm':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <EvmHiddenSwapTransferStoreProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        tokensAssets={useTokensAssets()}
                    >
                        <EvmToEvmHiddenSwap />
                    </EvmHiddenSwapTransferStoreProvider>
                </div>
            )

        case 'everscale-evm':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <EverscaleTransferStoreProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        tokensAssets={useTokensAssets()}
                    >
                        <EverscaleToEvm />
                    </EverscaleTransferStoreProvider>
                </div>
            )

        default:
            return null
    }
}
