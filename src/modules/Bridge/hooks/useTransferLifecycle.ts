import * as React from 'react'
import { reaction } from 'mobx'
import { useParams } from 'react-router-dom'

import { useSummary } from '@/modules/Bridge/providers/BridgeTransferSummaryProvider'
import {
    type EverscaleEvmPipeline,
    type EverscaleSolanaPipeline,
    type EvmEverscalePipeline,
    type SolanaEverscalePipeline,
} from '@/modules/Bridge/stores'
import {
    type EverscaleTransferUrlParams,
    type EvmTransferUrlParams,
    type SolanaTransferUrlParams,
} from '@/modules/Bridge/types'


type Pipeline =
    EverscaleEvmPipeline
    | EvmEverscalePipeline
    | EverscaleSolanaPipeline
    | SolanaEverscalePipeline

export function useTransferLifecycle(pipeline: Pipeline): void {
    const params = useParams<EverscaleTransferUrlParams | EvmTransferUrlParams | SolanaTransferUrlParams>()

    const summary = useSummary()

    if ('contractAddress' in params && summary.txAddress !== params.contractAddress) {
        summary.reset()
        summary.setData('txAddress', params.contractAddress)
    }
    else if ('txHash' in params && summary.txAddress !== params.txHash) {
        summary.reset()
        summary.setData('txAddress', params.txHash)
    }

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

        return reaction(
            () => ({
                amount: pipeline.amount,
                eversAmount: (pipeline as EvmEverscalePipeline).eversAmount,
                depositFee: (pipeline as EvmEverscalePipeline).depositFee,
                leftAddress: pipeline.leftAddress,
                leftNetwork: pipeline.leftNetwork,
                pipeline: pipeline.pipeline,
                rightAddress: pipeline.rightAddress,
                rightNetwork: pipeline.rightNetwork,
                token: pipeline.token,
                withdrawFee: (pipeline as EverscaleEvmPipeline).withdrawFee,
                pendingWithdrawals: (pipeline as EvmEverscalePipeline).pendingWithdrawals,
                success: pipeline.success,
            }),
            data => {
                summary.setData({
                    amount: data.amount ?? summary.amount,
                    eversAmount: data.eversAmount ?? summary.eversAmount,
                    depositFee: data.depositFee ?? summary.depositFee,
                    leftAddress: data.leftAddress ?? summary.leftAddress,
                    leftNetwork: data.leftNetwork ?? summary.leftNetwork,
                    pipeline: data.pipeline ?? summary.pipeline,
                    rightAddress: data.rightAddress ?? summary.rightAddress,
                    rightNetwork: data.rightNetwork ?? summary.rightNetwork,
                    token: data.token ?? summary.token,
                    withdrawFee: data.withdrawFee ?? summary.withdrawFee,
                    pendingWithdrawals: data.pendingWithdrawals ?? summary.pendingWithdrawals,
                    success: pipeline.success,
                })
            },
            { fireImmediately: true },
        )
    }, [])
}
