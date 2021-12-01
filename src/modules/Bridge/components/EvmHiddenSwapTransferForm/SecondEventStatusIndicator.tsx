import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'
import { CreditProcessorState } from '@/modules/Bridge/types'


function SecondEventStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const evmWallet = transfer.useEvmWallet
    const tonWallet = transfer.useTonWallet
    const isPrepareConfirmed = transfer.secondPrepareState?.status === 'confirmed'
    const status = transfer.secondEventState?.status || 'disabled'
    const isConfirmed = status === 'confirmed'
    const { confirmations = 0, requiredConfirmations = 0 } = { ...transfer.eventState }
    const waitingWallet = (
        (!evmWallet.isReady || !tonWallet.isReady)
        && isPrepareConfirmed
        && !isConfirmed
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && !isEqual(transfer.rightNetwork.chainId, evmWallet.chainId)
        && isPrepareConfirmed
        && !isConfirmed
    )

    return (
        <EventStatus
            confirmations={confirmations}
            isCancelled={transfer.creditProcessorState === CreditProcessorState.Cancelled}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_SECOND_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
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
                            network={transfer.rightNetwork}
                        />
                    )
                }

                return null
            })()}
        </EventStatus>
    )
}

export const SecondEventStatusIndicator = observer(SecondEventStatusIndicatorInner)
