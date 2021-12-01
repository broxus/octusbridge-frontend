import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EventStatus } from '@/modules/Bridge/components/Statuses/EventStatus'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmHiddenSwapTransfer } from '@/modules/Bridge/providers'


function FirstEventStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmHiddenSwapTransfer()

    const evmWallet = transfer.useEvmWallet
    const tonWallet = transfer.useTonWallet
    const isPrepareConfirmed = transfer.prepareState?.status === 'confirmed'
    const {
        confirmations = 0,
        requiredConfirmations = 0,
        status = 'disabled',
    } = { ...transfer.eventState }
    const isConfirmed = status === 'confirmed'
    const waitingWallet = (
        !tonWallet.isReady
        && isPrepareConfirmed
        && !isConfirmed
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.leftNetwork !== undefined
        && !isEqual(transfer.leftNetwork.chainId, evmWallet.chainId)
        && isPrepareConfirmed
        && !isConfirmed
    )

    return (
        <EventStatus
            confirmations={confirmations}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_FIRST_NOTE',
            })}
            requiredConfirmations={requiredConfirmations}
            status={status}
            txHash={transfer.deriveEventAddress?.toString()}
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

                return null
            })()}
        </EventStatus>
    )
}

export const FirstEventStatusIndicator = observer(FirstEventStatusIndicatorInner)
