import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { useEvmTransfer } from '@/modules/Bridge/providers'
import { sliceAddress } from '@/utils'


export function PrepareStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()
    const evmWallet = transfer.useEvmWallet
    const tonWallet = transfer.useTonWallet

    const onPrepare = async () => {
        if (
            transfer.transferState?.status !== 'confirmed'
            && transfer.prepareState !== undefined
            && ['confirmed', 'pending'].includes(transfer.prepareState.status)
        ) {
            return
        }

        await transfer.prepare()
    }

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
                    <span>
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                        })}
                    </span>
                    <Observer>
                        {() => (
                            <>
                                {(
                                    transfer.prepareState?.status === 'confirmed'
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

                <Observer>
                    {() => {
                        if (evmWallet.isInitializing || tonWallet.isInitializing) {
                            return null
                        }

                        return (evmWallet.isConnected && tonWallet.isConnected) ? (
                            <div className="crosschain-transfer__status-control-actions">
                                <Button
                                    disabled={(
                                        evmWallet.isConnecting
                                        || transfer.prepareState?.status === 'pending'
                                        || transfer.prepareState?.status === 'confirmed'
                                        || transfer.transferState?.status !== 'confirmed'
                                    )}
                                    type="primary"
                                    onClick={onPrepare}
                                >
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                                    })}
                                </Button>
                            </div>
                        ) : <WalletsConnectors />
                    }}
                </Observer>
            </div>
        </div>
    )
}
