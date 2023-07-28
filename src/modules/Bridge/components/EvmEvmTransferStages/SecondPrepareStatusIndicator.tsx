import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

// import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmEvmPipelineContext } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork, isEvmTxHashValid } from '@/utils'

export const SecondPrepareStatusIndicator = observer(() => {
    const intl = useIntl()
    const transfer = useEvmEvmPipelineContext()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const status = transfer.secondPrepareState?.status || 'disabled'
    // const isEventConfirmed = transfer.eventState?.status === 'confirmed'
    // const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    // const isPending = status === 'pending'
    // const waitingWallet = !transfer.tvmWallet.isReady && isEventConfirmed && !isConfirmed && !isPending

    // const onPrepare = async (): Promise<void> => {
    //     if (
    //         !isTransferPage
    //         || (transfer.prepareState !== undefined && ['confirmed', 'pending'].includes(transfer.prepareState.status))
    //     ) {
    //         return
    //     }
    //
    //     await transfer.prepare()
    // }

    return (
        <PrepareStatus
            isDeployed={transfer.secondPrepareState?.isDeployed}
            isDeploying={transfer.secondPrepareState?.isDeploying}
            isTransferPage={isTransferPage}
            note={intl.formatMessage(
                {
                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_SECOND_NOTE',
                },
                {
                    network: getEverscaleMainNetwork()?.label || '',
                },
            )}
            status={status}
            txHash={isConfirmed ? transfer.contractAddress?.toString() : undefined}
        >
            {/*
            {(() => {
                if (transfer.tvmWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <Button
                            disabled={transfer.tvmWallet.isConnecting || transfer.tvmWallet.isConnected}
                            type="primary"
                            onClick={transfer.tvmWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                if (
                    isTransferPage
                    && (transfer.transferState?.status !== 'confirmed' || !transfer.prepareState?.isOutdated)
                ) {
                    return null
                }

                if (
                    (!transfer.prepareState?.isDeployed ? isEventConfirmed : isDisabled)
                    && !isPending
                    && !isConfirmed
                ) {
                    return (
                        <Button
                            disabled={
                                !isTransferPage || !isEventConfirmed || !isDisabled || isConfirmed || isPending
                            }
                            type="primary"
                            onClick={isTransferPage ? onPrepare : undefined}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                return null
            })()}
            */}
        </PrepareStatus>
    )
})
