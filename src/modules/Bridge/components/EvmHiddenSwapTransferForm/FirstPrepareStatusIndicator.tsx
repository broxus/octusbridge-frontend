import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { getTonMainNetwork } from '@/utils'
import { CreditProcessorState } from '@/modules/Bridge/types'


function FirstPrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const evmWallet = transfer.useEvmWallet
    const tonWallet = transfer.useTonWallet
    const status = transfer.prepareState?.status || 'disabled'
    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
    const isConfirmed = status === 'confirmed'
    const waitingWallet = (
        (!evmWallet.isReady || !tonWallet.isReady)
        && isTransferConfirmed
        && !isConfirmed
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.leftNetwork !== undefined
        && !isEqual(transfer.leftNetwork.chainId, evmWallet.chainId)
        && isTransferConfirmed
        && !isConfirmed
    )

    return (
        <PrepareStatus
            isBroadcasting={transfer.prepareState?.isBroadcasting}
            isDeployed={transfer.creditProcessorState === undefined ? undefined : (
                transfer.creditProcessorState >= CreditProcessorState.EventConfirmed
                && transfer.creditProcessorState !== CreditProcessorState.EventRejected
            )}
            isDeploying={transfer.creditProcessorState === undefined || (
                transfer.creditProcessorState === CreditProcessorState.EventDeployInProgress
                && !transfer.prepareState?.isOutdated
                && status === 'pending'
            )}
            isTransferPage
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_FIRST_NOTE',
            }, {
                network: getTonMainNetwork()?.label || '',
            })}
            status={status}
            txHash={isConfirmed ? transfer.creditProcessorAddress?.toString() : undefined}
            waitingWallet={waitingWallet}
            wrongNetwork={wrongNetwork}
        >
            {(() => {
                if (evmWallet.isInitializing || tonWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <WalletsConnectors
                            evmWallet={evmWallet}
                            tonWallet={tonWallet}
                        />
                    )
                }

                if (wrongNetwork) {
                    return (
                        <WrongNetworkError
                            wallet={evmWallet}
                            network={transfer.leftNetwork}
                        />
                    )
                }

                if ((
                    transfer.prepareState?.isOutdated === true
                    && transfer.transferState?.confirmedBlocksCount !== undefined
                    && transfer.transferState.eventBlocksToConfirm !== undefined
                    && transfer.transferState.confirmedBlocksCount > transfer.transferState.eventBlocksToConfirm * 3
                )) {
                    return (
                        <Button
                            disabled={transfer.prepareState.isBroadcasting}
                            type="primary"
                            onClick={transfer.broadcast}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_STATUS_BROADCAST_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                return null
            })()}
        </PrepareStatus>
    )
}

export const FirstPrepareStatusIndicator = observer(FirstPrepareStatusIndicatorInner)
