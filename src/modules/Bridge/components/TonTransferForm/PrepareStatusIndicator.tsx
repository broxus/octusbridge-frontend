import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useTonTransferStore } from '@/modules/Bridge/providers/TonTransferStoreProvider'
import { useBridge } from '@/modules/Bridge/stores/CrosschainBridge'
import { isSameNetwork } from '@/modules/Bridge/utils'
import { PrepareStateStatus } from '@/modules/Bridge/types'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'
import { isTonAddressValid } from '@/utils'


export function PrepareStatusIndicator(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useTonTransferStore()
    const evmWallet = useEvmWallet()
    const tonWallet = useTonWallet()

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isTonAddressValid(transfer.contractAddress)
    )

    const [prepareState, setPrepareState] = React.useState<PrepareStateStatus>(
        isTransferPage ? (transfer.prepareState || 'pending') : 'disabled',
    )

    const onPrepare = async () => {
        if (isTransferPage || (
            transfer.prepareState !== undefined
            && ['confirmed', 'pending'].includes(transfer.prepareState)
        ) || prepareState === 'pending') {
            return
        }

        try {
            setPrepareState('pending')
            await bridge.prepareTonToEvm(() => {
                setPrepareState('disabled')
            })
        }
        catch (e) {
            setPrepareState('disabled')
        }
    }

    return (
        <div className="crosschain-transfer__status">
            <div className="crosschain-transfer__status-label">
                <Observer>
                    {() => {
                        const isEvmWalletReady = evmWallet.isInitialized && evmWallet.isConnected
                        const isTonWalletReady = tonWallet.isInitialized && tonWallet.isConnected
                        const state = isTransferPage ? (transfer.prepareState || 'disabled') : prepareState

                        if (
                            (!isEvmWalletReady || !isTonWalletReady)
                            && (isTransferPage ? transfer.prepareState === 'pending' : prepareState === 'pending')
                        ) {
                            return (
                                <StatusIndicator status="pending">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_STATUS_WAITING_WALLET',
                                    })}
                                </StatusIndicator>
                            )
                        }

                        return (
                            <StatusIndicator status={state}>
                                {(() => {
                                    switch (transfer.prepareState || prepareState) {
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

                        const isWalletsConnected = evmWallet.isConnected && tonWallet.isConnected
                        const isConfirmedPrepareState = transfer.prepareState === 'confirmed'
                        const isDisabledPrepareState = transfer.prepareState === undefined || transfer.prepareState === 'disabled'
                        const rightNetwork = bridge.rightNetwork || transfer.rightNetwork
                        const state = isTransferPage ? (transfer.prepareState || 'disabled') : prepareState
                        const isPendingPrepareState = state === 'pending'
                        const wrongNetwork = (
                            isWalletsConnected
                            && !isSameNetwork(rightNetwork?.chainId, evmWallet.chainId)
                            && rightNetwork !== undefined
                            && isDisabledPrepareState
                        )

                        if (wrongNetwork && isPendingPrepareState) {
                            return <WrongNetworkError network={rightNetwork} />
                        }

                        return (!isWalletsConnected && !isConfirmedPrepareState) ? (
                            <WalletsConnectors />
                        ) : (
                            <button
                                type="button"
                                className="btn btn-s btn--primary"
                                disabled={(
                                    isTransferPage
                                    || evmWallet.isConnecting
                                    || tonWallet.isConnecting
                                    || isPendingPrepareState
                                    || isConfirmedPrepareState
                                )}
                                onClick={onPrepare}
                            >
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                                })}
                            </button>
                        )
                    }}
                </Observer>
            </div>
        </div>
    )
}
