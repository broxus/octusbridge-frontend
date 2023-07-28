import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useEvmTvmPipelineContext } from '@/modules/Bridge/providers'
import { isEvmTxHashValid } from '@/utils'

export const PrepareStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEvmTvmPipelineContext()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const tvmWallet = isTransferPage ? transfer.tvmWallet : bridge.tvmWallet
    const rightNetwork = isTransferPage ? transfer.rightNetwork : bridge.rightNetwork

    const status = transfer.prepareState?.status || 'disabled'
    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const isOutdated = transfer.prepareState?.isOutdated

    const waitingWallet = (
        !tvmWallet.isReady
        && isTransferPage
        && isTransferConfirmed
        && !isConfirmed
        && !isPending
    )

    const onPrepare = async (): Promise<void> => {
        if (
            !isTransferPage
            || (transfer.prepareState !== undefined && ['confirmed', 'pending'].includes(transfer.prepareState.status))
        ) {
            return
        }

        await transfer.prepare()
    }

    return (
        <PrepareStatus
            isDeployed={isTransferPage && transfer.prepareState?.isDeployed}
            isDeploying={isTransferPage && transfer.prepareState?.isDeploying}
            isTransferPage={isTransferPage}
            note={intl.formatMessage(
                {
                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                },
                {
                    network: rightNetwork?.name || '',
                },
            )}
            status={status}
            txHash={isConfirmed ? transfer.deriveEventAddress?.toString() : undefined}
            waitingWallet={waitingWallet}
        >
            {(() => {
                switch (true) {
                    case tvmWallet.isInitializing:
                        return null

                    case waitingWallet:
                        return (
                            <Button
                                disabled={tvmWallet.isConnecting || tvmWallet.isConnected}
                                type="primary"
                                onClick={tvmWallet.connect}
                            >
                                {intl.formatMessage({
                                    id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                                })}
                            </Button>
                        )

                    case !isTransferPage && bridge.isSwapEnabled:
                    case isTransferPage && (!isTransferConfirmed || (!isOutdated && transfer.isSwapEnabled)):
                        return null

                    default:
                        return (
                            <Button
                                disabled={(
                                    !isTransferPage
                                    || !isTransferConfirmed
                                    || !isDisabled
                                    || isConfirmed
                                    || isPending
                                )}
                                type="primary"
                                onClick={isTransferPage ? onPrepare : undefined}
                            >
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                                })}
                            </Button>
                        )
                }
            })()}
        </PrepareStatus>
    )
})
