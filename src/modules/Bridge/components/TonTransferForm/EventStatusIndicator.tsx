import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useTonTransfer } from '@/modules/Bridge/providers/TonTransferStoreProvider'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { useEvmWallet } from '@/stores/EvmWalletService'


export function EventStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useTonTransfer()
    const evmWallet = useEvmWallet()

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-label">
                <Observer>
                    {() => (
                        <StatusIndicator
                            status={transfer.eventState?.status || 'disabled'}
                        >
                            {(() => {
                                const {
                                    confirmations = 0,
                                    requiredConfirmations = 0,
                                    status = 'disabled',
                                } = { ...transfer.eventState }

                                switch (status) {
                                    case 'confirmed':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: confirmations > 0
                                                ? 'CROSSCHAIN_TRANSFER_STATUS_EVENT_CONFIRMATION'
                                                : 'CROSSCHAIN_TRANSFER_STATUS_EVENT_PENDING',
                                        }, {
                                            confirmed: confirmations,
                                            confirmations: requiredConfirmations,
                                        })

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_DISABLED',
                                        })
                                }
                            })()}
                        </StatusIndicator>
                    )}
                </Observer>
            </div>
            <div className="crosschain-transfer__status-control">
                <div className="crosschain-transfer__status-note">
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STATUS_EVENT_NOTE',
                    })}
                </div>

                <Observer>
                    {() => (
                        <>
                            {(
                                evmWallet.isConnected
                                && !isSameNetwork(transfer.rightNetwork?.chainId, evmWallet.chainId)
                                && transfer.rightNetwork !== undefined
                                && transfer.prepareState === 'confirmed'
                                && transfer.eventState?.status !== 'confirmed'
                                && transfer.eventState?.status !== 'pending'
                            ) && (
                                <WrongNetworkError network={transfer.rightNetwork} />
                            )}
                        </>
                    )}
                </Observer>
            </div>
        </div>
    )
}
