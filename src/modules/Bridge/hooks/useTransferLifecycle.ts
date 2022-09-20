import * as React from 'react'
import { reaction } from 'mobx'
import { useParams } from 'react-router-dom'

import { useBridge } from '@/modules/Bridge/providers/CrosschainBridgeStoreProvider'
import type {
    EverscaleEvmPipeline,
    EverscaleSolanaPipeline,
    EvmEverscaleCreditPipeline,
    EvmEverscalePipeline,
    EvmEvmHiddenBridgePipeline,
    SolanaEverscalePipeline,
} from '@/modules/Bridge/stores'
import { EverscaleTransferUrlParams, EvmTransferUrlParams, SolanaTransferUrlParams } from '@/modules/Bridge/types'


type Pipeline = EverscaleEvmPipeline
    | EvmEverscalePipeline
    | EvmEverscaleCreditPipeline
    | EvmEvmHiddenBridgePipeline
    | EverscaleSolanaPipeline
    | SolanaEverscalePipeline

export function useTransferLifecycle(pipeline: Pipeline): void {
    const { summary } = useBridge()
    const params = useParams<EverscaleTransferUrlParams | EvmTransferUrlParams | SolanaTransferUrlParams>()

    React.useEffect(() => {
        (async () => {
            try {
                await pipeline.init()
            }
            catch (e) {}
        })()
        return () => pipeline.dispose()
    }, [params])

    React.useEffect(() => {
        summary.setState('isTransferPage', true)
        const summaryDisposer = reaction(
            () => ({
                amount: pipeline.amount,
                depositFee: (pipeline as EvmEverscalePipeline).depositFee,
                depositType: pipeline.depositType || params.depositType,
                everscaleAddress: (pipeline as EvmEvmHiddenBridgePipeline).everscaleAddress,
                leftAddress: pipeline.leftAddress,
                leftNetwork: pipeline.leftNetwork,
                maxTransferFee: (pipeline as EvmEvmHiddenBridgePipeline).maxTransferFee,
                minTransferFee: (pipeline as EvmEvmHiddenBridgePipeline).minTransferFee,
                pipeline: pipeline.pipeline,
                hiddenBridgePipeline: (pipeline as EvmEvmHiddenBridgePipeline).pipelineDefault,
                rightAddress: pipeline.rightAddress,
                rightNetwork: pipeline.rightNetwork,
                swapAmount: (pipeline as EvmEvmHiddenBridgePipeline).swapAmount,
                token: pipeline.token,
                tokenAmount: (pipeline as EvmEvmHiddenBridgePipeline).tokenAmount,
                withdrawFee: (pipeline as EverscaleEvmPipeline).withdrawFee,
                pendingWithdrawals: (pipeline as EvmEverscalePipeline).pendingWithdrawals,
            }),
            data => {
                summary.setData(data)
            },
            { fireImmediately: true },
        )

        const transferReleaseDisposer = reaction(
            () => (pipeline as EvmEvmHiddenBridgePipeline).releaseState?.isReleased,
            value => {
                summary.setState('isTransferReleased', value)
            },
        )

        return () => {
            summaryDisposer()
            transferReleaseDisposer()
            summary.reset()
        }
    }, [])
}
