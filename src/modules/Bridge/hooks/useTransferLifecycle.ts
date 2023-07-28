import { reaction } from 'mobx'
import * as React from 'react'
import { useParams } from 'react-router-dom'

import { useSummary } from '@/modules/Bridge/providers/BridgeTransferSummaryProvider'
import {
    type EvmEvmPipeline,
    type EvmTvmPipeline,
    type SolanaTvmPipeline,
    type TvmEvmPipeline,
    type TvmSolanaPipeline,
} from '@/modules/Bridge/stores'
import {
    type EvmTransferUrlParams,
    type SolanaTransferUrlParams,
    type TvmTransferUrlParams,
} from '@/modules/Bridge/types'

type Pipeline = TvmEvmPipeline | EvmTvmPipeline | EvmEvmPipeline | TvmSolanaPipeline | SolanaTvmPipeline

export function useTransferLifecycle(pipeline: Pipeline): void {
    const params = useParams<TvmTransferUrlParams | EvmTransferUrlParams | SolanaTransferUrlParams>()

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
                depositFee: (pipeline as EvmTvmPipeline).depositFee,
                expectedEversAmount: (pipeline as EvmTvmPipeline).expectedEversAmount,
                leftAddress: pipeline.leftAddress,
                leftNetwork: pipeline.leftNetwork,
                pendingWithdrawals: (pipeline as EvmTvmPipeline).pendingWithdrawals,
                pipeline: pipeline.pipeline,
                rightAddress: pipeline.rightAddress,
                rightNetwork: pipeline.rightNetwork,
                secondDepositFee: (pipeline as EvmEvmPipeline).secondDepositFee,
                secondPipeline: (pipeline as EvmEvmPipeline).secondPipeline,
                secondWithdrawFee: (pipeline as EvmEvmPipeline).secondWithdrawFee,
                success: pipeline.success,
                token: pipeline.token,
                tvmAddress: (pipeline as EvmEvmPipeline).tvmAddress,
                withdrawFee: (pipeline as TvmEvmPipeline).withdrawFee,
            }),
            data => {
                summary.setData({
                    amount: data.amount ?? summary.amount,
                    depositFee: data.depositFee ?? summary.depositFee,
                    expectedEversAmount: data.expectedEversAmount ?? summary.expectedEversAmount,
                    leftAddress: data.leftAddress ?? summary.leftAddress,
                    leftNetwork: data.leftNetwork ?? summary.leftNetwork,
                    pendingWithdrawals: data.pendingWithdrawals ?? summary.pendingWithdrawals,
                    pipeline: data.pipeline ?? summary.pipeline,
                    rightAddress: data.rightAddress ?? summary.rightAddress,
                    rightNetwork: data.rightNetwork ?? summary.rightNetwork,
                    secondDepositFee: data.secondDepositFee ?? summary.secondDepositFee,
                    secondPipeline: data.secondPipeline ?? summary.secondPipeline,
                    secondWithdrawFee: data.secondWithdrawFee ?? summary.secondWithdrawFee,
                    success: pipeline.success,
                    token: data.token ?? summary.token,
                    tvmAddress: data.tvmAddress ?? summary.tvmAddress,
                    withdrawFee: data.withdrawFee ?? summary.withdrawFee,
                })
            },
            { fireImmediately: true },
        )
    }, [])
}
