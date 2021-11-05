import * as React from 'react'
import { useIntl } from 'react-intl'

import {
    EvmSwapTransferStoreProvider,
    EvmToTonStatus,
    EvmToTonSwapStatus,
    EvmTransferStoreProvider,
    TonToEvmStatus,
    TonTransferStoreProvider,
} from '@/modules/Bridge'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'


type Props = {
    depositType?: 'default' | 'credit';
    direction?: 'ton-evm' | 'evm-ton' | 'evm-evm';
}


export default function Page({ depositType, direction }: Props): JSX.Element | null {
    const intl = useIntl()

    switch (direction) {
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

                    {depositType === 'credit' ? (
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

        case 'evm-evm':
        default:
            return null
    }
}
