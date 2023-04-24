import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import {
    EverscaleEvmPipelineProvider,
    EverscaleSolanaPipelineProvider,
    EverscaleToEvm,
    EverscaleToSolana,
    EvmEverscalePipelineProvider,
    EvmToEverscale,
    SolanaEverscalePipelineProvider,
    SolanaToEverscale,
} from '@/modules/Bridge'
import type { TransferUrlBaseParams } from '@/modules/Bridge/types'
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

                    <EverscaleEvmPipelineProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EverscaleToEvm />
                    </EverscaleEvmPipelineProvider>
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

                    <EvmEverscalePipelineProvider
                        evmWallet={useEvmWallet()}
                        everWallet={useEverWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EvmToEverscale />
                    </EvmEverscalePipelineProvider>
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

                    <EverscaleSolanaPipelineProvider
                        everWallet={useEverWallet()}
                        solanaWallet={useSolanaWallet()}
                        bridgeAssets={useBridgeAssets()}
                    >
                        <EverscaleToSolana />
                    </EverscaleSolanaPipelineProvider>
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
