import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useSolanaTvmPipelineContext } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork, isSolanaTxSignatureValid } from '@/utils'

function PrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useSolanaTvmPipelineContext()

    const isTransferPage = transfer.txSignature !== undefined && isSolanaTxSignatureValid(transfer.txSignature)
    const everWallet = transfer.useEverWallet
    const status = transfer.prepareState?.status || 'disabled'
    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const waitingWallet = (
        !everWallet.isReady
        && isTransferConfirmed
        && !isConfirmed
        && !isPending
    )

    const onPrepare = async () => {
        if (
            !isTransferPage
            || (
                transfer.prepareState !== undefined
                && ['confirmed', 'pending'].includes(transfer.prepareState.status)
            )
        ) {
            return
        }

        await transfer.prepare()
    }

    return (
        <PrepareStatus
            isDeployed={transfer.prepareState?.isDeployed}
            isDeploying={transfer.prepareState?.isDeploying}
            isTokenDeploying={transfer.prepareState?.isTokenDeploying}
            isTransferPage={isTransferPage}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
            }, {
                network: getEverscaleMainNetwork()?.label || '',
            })}
            status={status}
            txHash={isConfirmed ? transfer.deriveEventAddress?.toString() : undefined}
            waitingWallet={waitingWallet}
        >
            {(() => {
                if (everWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <Button
                            disabled={everWallet.isConnecting || everWallet.isConnected}
                            type="primary"
                            onClick={everWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                return (
                    <Button
                        disabled={(!isTransferPage || (
                            !isTransferConfirmed
                            || !isDisabled
                            || isConfirmed
                            || isPending
                        ))}
                        type="primary"
                        onClick={isTransferPage ? onPrepare : undefined}
                    >
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                        })}
                    </Button>
                )
            })()}
        </PrepareStatus>
    )
}

export const PrepareStatusIndicator = observer(PrepareStatusIndicatorInner)
