import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { useEvmTransferStoreContext } from '@/modules/Bridge/providers/EvmTransferStoreProvider'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'


export function PrepareStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransferStoreContext()
    const evmWallet = useEvmWallet()
    const tonWallet = useTonWallet()

    const onPrepare = async () => {
        if (
            transfer.transferState?.status !== 'confirmed'
            && transfer.prepareState !== undefined
            && ['confirmed', 'pending'].includes(transfer.prepareState)
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
                            status={transfer.prepareState || 'disabled'}
                        >
                            {(() => {
                                switch (transfer.prepareState) {
                                    case 'confirmed':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_PENDING',
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
                <p>
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                    })}
                </p>

                <Observer>
                    {() => {
                        if (evmWallet.isInitializing || tonWallet.isInitializing) {
                            return null
                        }

                        return (evmWallet.isConnected && tonWallet.isConnected) ? (
                            <button
                                type="button"
                                className="btn btn-s btn--primary"
                                disabled={(
                                    evmWallet.isConnecting
                                    || transfer.prepareState === 'pending'
                                    || transfer.prepareState === 'confirmed'
                                    || transfer.transferState?.status !== 'confirmed'
                                )}
                                onClick={onPrepare}
                            >
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                                })}
                            </button>
                        ) : <WalletsConnectors />
                    }}
                </Observer>
            </div>
        </div>
    )
}
