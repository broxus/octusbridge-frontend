import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import {
    EverscaleEvmPipelineProvider,
    EverscaleSolanaPipelineProvider,
    EverscaleToEvm,
    EverscaleToSolana,
    EvmEverscaleCreditPipelineProvider,
    EvmEverscalePipelineProvider,
    EvmEvmHiddenBridgePipelineProvider,
    EvmToEverscale,
    EvmToEverscaleSwap,
    EvmToEvmHiddenSwap,
    SolanaEverscalePipelineProvider,
    SolanaToEverscale,
} from '@/modules/Bridge'
import type { TransferUrlBaseParams } from '@/modules/Bridge/types'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useSolanaWallet } from '@/stores/SolanaWalletService'


export default function Page(): JSX.Element | null {
    const intl = useIntl()
    const params = useParams<TransferUrlBaseParams>()

    switch (`${params.fromType}-${params.toType}`) {
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

                    <EverscaleEvmPipelineProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EverscaleToEvm />
                    </EverscaleEvmPipelineProvider>
                </div>
            )

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
                        <EvmEverscaleCreditPipelineProvider
                            evmWallet={useEvmWallet()}
                            everWallet={useEverWallet()}
                            bridgeAssets={useBridgeAssets()}
                        >
                            <EvmToEverscaleSwap />
                        </EvmEverscaleCreditPipelineProvider>
                    ) : (
                        <EvmEverscalePipelineProvider
                            evmWallet={useEvmWallet()}
                            everWallet={useEverWallet()}
                            bridgeAssets={useBridgeAssets()}
                        >
                            <EvmToEverscale />
                        </EvmEverscalePipelineProvider>
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

                    <EvmEvmHiddenBridgePipelineProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EvmToEvmHiddenSwap />
                    </EvmEvmHiddenBridgePipelineProvider>
                </div>
            )

        case 'everscale-solana':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <EverscaleSolanaPipelineProvider
                        everWallet={useEverWallet()}
                        solanaWallet={useSolanaWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EverscaleToSolana />
                    </EverscaleSolanaPipelineProvider>
                </div>
            )

        case 'solana-everscale':
            return (
                <div className="container container--large">
                    <header className="page-header">
                        <h1 className="page-title">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                            })}
                        </h1>
                    </header>

                    <SolanaEverscalePipelineProvider
                        everWallet={useEverWallet()}
                        solanaWallet={useSolanaWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <SolanaToEverscale />
                    </SolanaEverscalePipelineProvider>
                </div>
            )

        default:
            return null
    }
}
