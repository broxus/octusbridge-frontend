import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import {
    EvmEvmPipelineProvider,
    EvmToEvm,
    EvmToTvm,
    EvmTvmPipelineProvider,
    SolanaToTvm,
    SolanaTvmPipelineProvider,
    TvmEvmPipelineProvider,
    TvmSolanaPipelineProvider,
    TvmToEvm,
    TvmToSolana,
} from '@/modules/Bridge'
import { type TransferUrlBaseParams } from '@/modules/Bridge/types'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useSolanaWallet } from '@/stores/SolanaWalletService'
import { getAssociatedNetwork } from '@/utils'

export default function Page(): JSX.Element | null {
    const intl = useIntl()
    const params = useParams<TransferUrlBaseParams>()

    const fromType = getAssociatedNetwork(params.fromType)
    const toType = getAssociatedNetwork(params.toType)

    switch (`${fromType}-${toType}`) {
        case 'tvm-evm':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <TvmEvmPipelineProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <TvmToEvm />
                    </TvmEvmPipelineProvider>
                </div>
            )

        case 'evm-tvm':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <EvmTvmPipelineProvider
                        evmWallet={useEvmWallet()}
                        tvmWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EvmToTvm />
                    </EvmTvmPipelineProvider>
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

                    <EvmEvmPipelineProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EvmToEvm />
                    </EvmEvmPipelineProvider>
                </div>
            )

        case 'tvm-solana':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <TvmSolanaPipelineProvider
                        everWallet={useEverWallet()}
                        solanaWallet={useSolanaWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <TvmToSolana />
                    </TvmSolanaPipelineProvider>
                </div>
            )

        case 'solana-tvm':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <SolanaTvmPipelineProvider
                        everWallet={useEverWallet()}
                        solanaWallet={useSolanaWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <SolanaToTvm />
                    </SolanaTvmPipelineProvider>
                </div>
            )

        default:
            return null
    }
}
