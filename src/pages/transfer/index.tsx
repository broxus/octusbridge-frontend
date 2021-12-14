import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import {
    EvmHiddenSwapTransferStoreProvider,
    EvmSwapTransferStoreProvider,
    EvmToEvmHiddenSwapStatus,
    EvmToTonStatus,
    EvmToTonSwapStatus,
    EvmTransferStoreProvider,
    TonToEvmStatus,
    TonTransferStoreProvider,
} from '@/modules/Bridge'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'
import { EvmTransferQueryParams } from '@/modules/Bridge/types'


export default function Page(): JSX.Element | null {
    const intl = useIntl()
    const params = useParams<EvmTransferQueryParams>()

    switch (`${params.fromType}-${params.toType}`) {
        case 'evm-ton':
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
                            tonWallet={useTonWallet()}
                            tokensCache={useTokensCache()}
                        >
                            <EvmToTonSwapStatus />
                        </EvmSwapTransferStoreProvider>
                    ) : (
                        <EvmTransferStoreProvider
                            evmWallet={useEvmWallet()}
                            tonWallet={useTonWallet()}
                            tokensCache={useTokensCache()}
                        >
                            <EvmToTonStatus />
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
                        tonWallet={useTonWallet()}
                        tokensCache={useTokensCache()}
                    >
                        <EvmToEvmHiddenSwapStatus />
                    </EvmHiddenSwapTransferStoreProvider>
                </div>
            )

        case 'ton-evm':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <TonTransferStoreProvider
                        evmWallet={useEvmWallet()}
                        tonWallet={useTonWallet()}
                        tokensCache={useTokensCache()}
                    >
                        <TonToEvmStatus />
                    </TonTransferStoreProvider>
                </div>
            )

        default:
            return null
    }
}
