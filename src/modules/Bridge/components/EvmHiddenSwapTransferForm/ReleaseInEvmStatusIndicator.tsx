import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge, useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'
import { isEvmTxHashValid } from '@/utils'


function ReleaseInEvmStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()
    const transfer = useEvmHiddenSwapTransfer()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const evmWallet = transfer.useEvmWallet
    const everWallet = transfer.useEverWallet
    const isEventConfirmed = transfer.secondEventState?.status === 'confirmed'
    const status = transfer.releaseState?.status || 'disabled'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const rightNetwork = isTransferPage ? transfer.rightNetwork : bridge.rightNetwork
    const waitingWallet = (
        (!evmWallet.isReady || !everWallet.isReady)
        && isEventConfirmed
        && !isConfirmed
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && !isEqual(transfer.rightNetwork.chainId, evmWallet.chainId)
        && isEventConfirmed
        && !isConfirmed
    )

    const onRelease = async () => {
        if (!isTransferPage || (
            transfer.releaseState !== undefined
            && ['confirmed', 'pending'].includes(transfer.releaseState.status)
            && transfer.creditProcessorState !== CreditProcessorState.Processed
        )) {
            return
        }

        await transfer.release()
    }

    console.log('KNPDJSHF:DSN:LKKFNDHSJK', transfer)

    return (
        <ReleaseStatus
            isCancelled={transfer.creditProcessorState === CreditProcessorState.Cancelled}
            isReleased={transfer.releaseState?.isReleased}
            status={status}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: rightNetwork?.label || '',
            })}
            waitingWallet={waitingWallet}
            wrongNetwork={wrongNetwork}
        >
            {(() => {
                if (evmWallet.isInitializing || everWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <WalletsConnectors
                            evmWallet={evmWallet}
                            everWallet={everWallet}
                        />
                    )
                }

                if (wrongNetwork) {
                    return (
                        <WrongNetworkError
                            network={transfer.rightNetwork}
                            wallet={evmWallet}
                        />
                    )
                }

                return (
                    <Button
                        disabled={(!isTransferPage || (
                            !isEventConfirmed
                            || !isDisabled
                            || isConfirmed
                            || isPending
                        ))}
                        type="primary"
                        onClick={isTransferPage ? onRelease : undefined}
                    >
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_BTN_TEXT',
                        })}
                    </Button>
                )
            })()}
        </ReleaseStatus>
    )
}

export const ReleaseInEvmStatusIndicator = observer(ReleaseInEvmStatusIndicatorInner)
