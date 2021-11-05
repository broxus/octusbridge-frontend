import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { useEvmSwapTransfer } from '@/modules/Bridge/providers'
import { sliceAddress } from '@/utils'


export function PrepareStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmSwapTransfer()

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-label">
                <Observer>
                    {() => (
                        <StatusIndicator
                            status={transfer.prepareState?.status || 'disabled'}
                        >
                            {(() => {
                                switch (transfer.prepareState?.status) {
                                    case 'confirmed':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_PENDING',
                                        })

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_DISABLED',
                                        })
                                }
                            })()}
                        </StatusIndicator>
                    )}
                </Observer>
            </div>
            <div className="crosschain-transfer__status-control">
                <div className="crosschain-transfer__status-note">
                    <Observer>
                        {() => (
                            <>
                                <span>
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                                    })}
                                </span>
                                {(
                                    transfer.prepareState?.status === 'confirmed'
                                    && transfer.creditProcessorAddress !== undefined
                                ) && (
                                    <TonscanAccountLink
                                        key="tx-link"
                                        address={transfer.creditProcessorAddress.toString()}
                                        className="text-muted"
                                        copy
                                    >
                                        {sliceAddress(transfer.creditProcessorAddress.toString())}
                                    </TonscanAccountLink>
                                )}
                            </>
                        )}
                    </Observer>
                </div>
                <Observer>
                    {() => (
                        <>
                            {(
                                transfer.prepareState?.isOutdated === true
                                && transfer.transferState!.confirmedBlocksCount > (transfer.transferState!.eventBlocksToConfirm * 3)
                            ) && (
                                <Button
                                    disabled={transfer.prepareState.isBroadcasting}
                                    type="primary"
                                    onClick={transfer.broadcast}
                                >
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_BROADCAST_BTN_TEXT',
                                    })}
                                </Button>
                            )}
                        </>
                    )}
                </Observer>
            </div>
        </div>
    )
}
