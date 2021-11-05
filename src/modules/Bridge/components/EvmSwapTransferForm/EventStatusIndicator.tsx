import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'
import { sliceAddress } from '@/utils'


export function EventStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmSwapTransfer()

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
                    <Observer>
                        {() => (
                            <>
                                {(
                                    transfer.eventState?.status === 'confirmed'
                                    && transfer.deriveEventAddress !== undefined
                                ) && (
                                    <TonscanAccountLink
                                        key="tx-link"
                                        address={transfer.deriveEventAddress.toString()}
                                        className="text-muted"
                                        copy
                                    >
                                        {sliceAddress(transfer.deriveEventAddress.toString())}
                                    </TonscanAccountLink>
                                )}
                            </>
                        )}
                    </Observer>
                </div>
            </div>
        </div>
    )
}
