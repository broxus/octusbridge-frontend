import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { useEvmTransferStatusStore } from '@/modules/CrosschainTransfer/providers'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'


export function EvmTransferForm(): JSX.Element {
    const transfer = useCrosschainTransfer()
    const transferStatus = useEvmTransferStatusStore()

    const [transferStatusState, setTransferStatus] = React.useState<'pending' | 'disabled'>()

    const onTransfer = async () => {
        try {
            setTransferStatus('pending')
            await transfer.transfer(() => {
                setTransferStatus('disabled')
            })
        }
        catch (e) {
            setTransferStatus('disabled')
        }
    }

    const onPrepare = async () => {
        await transferStatus.prepare()
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <Observer>
                    {() => (
                        <div className="crosschain-transfer__status">
                            <div className="crosschain-transfer__status-label">
                                <StatusIndicator
                                    status={transferStatus.transferState?.status || transferStatusState || 'disabled'}
                                >
                                    {(() => {
                                        const {
                                            confirmedBlocksCount = 0,
                                            eventBlocksToConfirm = 0,
                                            status = transferStatusState || 'disabled',
                                        } = { ...transferStatus.transferState }

                                        switch (true) {
                                            case status === 'pending' && confirmedBlocksCount === 0:
                                                return 'Pending'

                                            case status === 'confirmed':
                                                return 'Confirmed'

                                            case status === 'pending' && confirmedBlocksCount > 0:
                                                return `Confirming ${confirmedBlocksCount}/${eventBlocksToConfirm}`

                                            default:
                                                return 'Awaiting'
                                        }
                                    })()}
                                </StatusIndicator>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <p>
                                    Transfer tokens to the Ethereum vault
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-s btn--primary"
                                    onClick={onTransfer}
                                    disabled={
                                        transferStatus.transferState?.status === 'pending'
                                        || transferStatusState === 'pending'
                                        || !!transferStatus.transferState
                                    }
                                >
                                    Transfer
                                </button>
                            </div>
                        </div>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <div className="crosschain-transfer__status">
                            <div className="crosschain-transfer__status-label">
                                <StatusIndicator
                                    status={transferStatus.prepareState || 'disabled'}
                                >
                                    {(() => {
                                        switch (transferStatus.prepareState) {
                                            case 'pending':
                                                return 'Pending'

                                            case 'confirmed':
                                                return 'Confirmed'

                                            default:
                                                return 'Awaiting'
                                        }
                                    })()}
                                </StatusIndicator>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <p>
                                    Prepare transfer in Free TON
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-s btn--primary"
                                    disabled={(
                                        transferStatus.transferState?.status !== 'confirmed'
                                        || transferStatus.prepareState === 'pending'
                                        || transferStatus.prepareState === 'confirmed'
                                    )}
                                    onClick={onPrepare}
                                >
                                    Prepare
                                </button>
                            </div>
                        </div>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <div className="crosschain-transfer__status">
                            <div className="crosschain-transfer__status-label">
                                <StatusIndicator
                                    status={transferStatus.eventState?.status || 'disabled'}
                                >
                                    {(() => {
                                        const {
                                            confirmations = 0,
                                            requiredConfirmations = 0,
                                            status = 'disabled',
                                        } = { ...transferStatus.eventState }
                                        switch (true) {
                                            case status === 'confirmed':
                                                return 'Confirmed'

                                            case status === 'pending' && confirmations === 0:
                                                return 'Pending'

                                            case status === 'pending' && confirmations >= 0:
                                                return `Confirming ${confirmations}/${requiredConfirmations}`

                                            default:
                                                return 'Awaiting'
                                        }
                                    })()}
                                </StatusIndicator>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <p>
                                    Transfer checked by relayers
                                </p>
                            </div>
                        </div>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <div className="crosschain-transfer__status">
                            <div className="crosschain-transfer__status-label">
                                <StatusIndicator
                                    status={transferStatus.eventState?.status || 'disabled'}
                                >
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {transferStatus.eventState?.status === 'confirmed'
                                        ? 'Confirmed'
                                        : transferStatus.eventState?.status === 'pending' ? 'Pending' : 'Awaiting'}
                                </StatusIndicator>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <p>
                                    Release transfer in Free TON
                                </p>
                            </div>
                        </div>
                    )}
                </Observer>
            </div>
        </div>
    )
}
