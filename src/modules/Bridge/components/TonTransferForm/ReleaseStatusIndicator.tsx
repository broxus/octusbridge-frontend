import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useTonTransfer } from '@/modules/Bridge/providers/TonTransferStoreProvider'
import { ReleaseStateStatus } from '@/modules/Bridge/types'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { isTonAddressValid } from '@/utils'
import { useTonWallet } from '@/stores/TonWalletService'


export function ReleaseStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const transfer = useTonTransfer()
    const evmWallet = useEvmWallet()
    const tonWallet = useTonWallet()

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isTonAddressValid(transfer.contractAddress.toString())
    )

    const [releaseState, setReleaseState] = React.useState<ReleaseStateStatus>(
        isTransferPage ? (transfer.releaseState || 'disabled') : 'disabled',
    )

    const onRelease = async () => {
        if (
            transfer.releaseState !== undefined
            && ['confirmed', 'pending'].includes(transfer.releaseState)
        ) {
            return
        }

        try {
            setReleaseState('pending')
            await transfer.release(() => {
                setReleaseState('disabled')
            })
        }
        catch (e) {
            setReleaseState('disabled')
        }
    }

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-label">
                <Observer>
                    {() => (
                        <StatusIndicator
                            status={transfer.releaseState || releaseState}
                        >
                            {(() => {
                                switch (transfer.releaseState || releaseState) {
                                    case 'confirmed':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_CONFIRMED',
                                        })

                                    case 'pending':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_PENDING',
                                        })

                                    case 'rejected':
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_REJECTED',
                                        })

                                    default:
                                        return intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_DISABLED',
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
                        id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_ETH_NOTE',
                    })}
                </div>

                <Observer>
                    {() => {
                        if (evmWallet.isInitializing || tonWallet.isInitializing) {
                            return null
                        }

                        const state = transfer.releaseState || releaseState
                        const wrongNetwork = (
                            evmWallet.isConnected
                            && tonWallet.isConnected
                            && !isSameNetwork(transfer.rightNetwork?.chainId, evmWallet.chainId)
                            && transfer.rightNetwork !== undefined
                            && transfer.prepareState === 'confirmed'
                            && transfer.eventState?.status === 'confirmed'
                            && transfer.releaseState !== 'confirmed'
                        )

                        if (wrongNetwork) {
                            return <WrongNetworkError network={transfer.rightNetwork} />
                        }

                        return (
                            !evmWallet.isConnected
                            && transfer.prepareState === 'confirmed'
                            && transfer.eventState?.status === 'confirmed'
                            && ['confirmed', 'pending', 'rejected'].includes(state)
                        )
                            ? (
                                <Button
                                    disabled={evmWallet.isInitializing || evmWallet.isConnecting}
                                    size="sm"
                                    type="primary"
                                    onClick={evmWallet.connect}
                                >
                                    {intl.formatMessage({
                                        id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                                    })}
                                </Button>
                            )
                            : (
                                <Button
                                    disabled={(
                                        evmWallet.isInitializing
                                        || evmWallet.isConnecting
                                        || transfer.prepareState !== 'confirmed'
                                        || transfer.eventState?.status !== 'confirmed'
                                        || ['confirmed', 'pending', 'rejected'].includes(state)
                                    )}
                                    type="primary"
                                    onClick={onRelease}
                                >
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_BTN_TEXT',
                                    })}
                                </Button>
                            )
                    }}
                </Observer>
            </div>
        </div>
    )
}
