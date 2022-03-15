import * as React from 'react'
import { reaction } from 'mobx'
import { useParams } from 'react-router-dom'

import type {
    EverscaleToEvmPipeline,
    EvmToEverscalePipeline,
    EvmToEverscaleSwapPipeline,
    EvmToEvmHiddenSwapPipeline,
} from '@/modules/Bridge/stores'
import { useSummary } from '@/modules/Bridge/stores'
import { EverscaleTransferQueryParams, EvmTransferQueryParams } from '@/modules/Bridge/types'


type Pipeline = EverscaleToEvmPipeline
    | EvmToEverscalePipeline
    | EvmToEverscaleSwapPipeline
    | EvmToEvmHiddenSwapPipeline

export function useTransferLifecycle(pipeline: Pipeline): void {
    const params = useParams<EvmTransferQueryParams | EverscaleTransferQueryParams>()

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
        const summary = useSummary()
        summary.setState('isTransferPage', true)
        const summaryDisposer = reaction(
            () => ({
                amount: pipeline.amount,
                everscaleAddress: (pipeline as EvmToEvmHiddenSwapPipeline).everscaleAddress,
                leftAddress: pipeline.leftAddress,
                leftNetwork: pipeline.leftNetwork,
                maxTransferFee: (pipeline as EvmToEvmHiddenSwapPipeline).maxTransferFee,
                minTransferFee: (pipeline as EvmToEvmHiddenSwapPipeline).minTransferFee,
                rightAddress: pipeline.rightAddress,
                rightNetwork: pipeline.rightNetwork,
                swapAmount: (pipeline as EvmToEvmHiddenSwapPipeline).swapAmount,
                token: pipeline.token,
                tokenAmount: (pipeline as EvmToEvmHiddenSwapPipeline).tokenAmount,
            }),
            data => {
                summary.setData(data)
            },
        )

        const transferReleaseDisposer = reaction(
            () => (pipeline as EvmToEvmHiddenSwapPipeline).releaseState?.isReleased,
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
