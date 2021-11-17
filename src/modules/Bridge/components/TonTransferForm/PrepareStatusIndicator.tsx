import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { BeforeUnloadAlert } from '@/modules/Bridge/components/BeforeUnloadAlert'
import { useBridge, useTonTransfer } from '@/modules/Bridge/providers'
import { PrepareStateStatus } from '@/modules/Bridge/types'
import { isTonAddressValid, sliceAddress } from '@/utils'


export function PrepareStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useTonTransfer()

    const [prepareStatus, setPrepareStatus] = React.useState<PrepareStateStatus>('disabled')

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isTonAddressValid(transfer.contractAddress.toString())
    )

    const onPrepare = async () => {
        if (isTransferPage || prepareStatus === 'pending') {
            return
        }

        try {
            setPrepareStatus('pending')
            await bridge.prepareTonToEvm(() => {
                setPrepareStatus('disabled')
            })
        }
        catch (e) {
            setPrepareStatus('disabled')
        }
    }

    return (
        <div className="crosschain-transfer__status">
            <Observer>
                {() => {
                    const tonWallet = isTransferPage ? transfer.useTonWallet : bridge.useTonWallet
                    const isTonWalletReady = (
                        !tonWallet.isInitializing
                        && !tonWallet.isConnecting
                        && tonWallet.isInitialized
                        && tonWallet.isConnected
                    )
                    const status = isTransferPage ? (transfer.prepareState?.status || 'disabled') : prepareStatus
                    const isConfirmed = status === 'confirmed'
                    const isPending = status === 'pending'

                    return (
                        <>
                            <div className="crosschain-transfer__status-indicator">
                                <Observer>
                                    {() => {
                                        if (!isTonWalletReady && !isConfirmed) {
                                            return (
                                                <StatusIndicator status="pending">
                                                    {intl.formatMessage({
                                                        id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_WALLET',
                                                    })}
                                                </StatusIndicator>
                                            )
                                        }

                                        return (
                                            <StatusIndicator status={status}>
                                                {(() => {
                                                    switch (status) {
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
                                        )
                                    }}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <div className="crosschain-transfer__status-note">
                                    <div>
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
                                        })}
                                    </div>
                                    {transfer.contractAddress !== undefined && (
                                        <TonscanAccountLink
                                            key="contract-link"
                                            address={transfer.contractAddress.toString()}
                                            className="text-muted"
                                            copy
                                        >
                                            {sliceAddress(transfer.contractAddress.toString())}
                                        </TonscanAccountLink>
                                    )}
                                </div>

                                <Observer>
                                    {() => {
                                        if (tonWallet.isInitializing) {
                                            return null
                                        }

                                        if (!isTonWalletReady && !isConfirmed) {
                                            return (
                                                <Button
                                                    disabled={tonWallet.isConnecting || tonWallet.isConnected}
                                                    type="primary"
                                                    onClick={tonWallet.connect}
                                                >
                                                    {intl.formatMessage({
                                                        id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                                                    })}
                                                </Button>
                                            )
                                        }

                                        return (
                                            <Button
                                                disabled={(
                                                    isTransferPage
                                                    || !isTonWalletReady
                                                    || isPending
                                                    || isConfirmed
                                                )}
                                                type="primary"
                                                onClick={!isTransferPage ? onPrepare : undefined}
                                            >
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                                                })}
                                            </Button>
                                        )
                                    }}
                                </Observer>
                            </div>
                        </>
                    )
                }}
            </Observer>
            {prepareStatus === 'pending' && (
                <BeforeUnloadAlert key="unload-alert" />
            )}
        </div>
    )
}
