import * as React from 'react'
import { reaction } from 'mobx'
import { useParams } from 'react-router-dom'

import type {
    EvmToEvmHiddenSwapTransfer,
    EvmToTonSwapTransfer,
    EvmToTonTransfer,
    TonToEvmTransfer,
} from '@/modules/Bridge/stores'
import { useSummary } from '@/modules/Bridge/stores'
import { EvmTransferQueryParams, TonTransferQueryParams } from '@/modules/Bridge/types'


type Transfer = TonToEvmTransfer | EvmToTonTransfer | EvmToTonSwapTransfer | EvmToEvmHiddenSwapTransfer

export function useTransferLifecycle(transfer: Transfer): void {
    const params = useParams<EvmTransferQueryParams | TonTransferQueryParams>()

    React.useEffect(() => {
        (async () => {
            try {
                await transfer.init()
            }
            catch (e) {}
        })()
        return () => transfer.dispose()
    }, [params])

    React.useEffect(() => {
        const summary = useSummary()
        const summaryDisposer = reaction(
            () => ({
                amount: transfer.amountNumber.toFixed(),
                decimals: transfer.decimals,
                everscaleAddress: (transfer as EvmToEvmHiddenSwapTransfer).everscaleAddress,
                leftAddress: transfer.leftAddress,
                leftNetwork: transfer.leftNetwork,
                maxTransferFee: (transfer as EvmToEvmHiddenSwapTransfer).maxTransferFee,
                minTransferFee: (transfer as EvmToEvmHiddenSwapTransfer).minTransferFee,
                rightAddress: transfer.rightAddress,
                rightNetwork: transfer.rightNetwork,
                token: transfer.token,
            }),
            data => {
                summary.update(data)
            },
        )
        return () => {
            summaryDisposer()
        }
    }, [])
}
