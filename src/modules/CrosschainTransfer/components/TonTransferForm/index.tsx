import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { StatusIndicator } from '@/components/common/StatusIndicator'
import { useTonTransferStatusStore } from '@/modules/CrosschainTransfer/providers'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'


export function TonTransferForm(): JSX.Element {
    const transfer = useCrosschainTransfer()
    const transferStatus = useTonTransferStatusStore()

    const [prepareStatusState, setPrepareStatus] = React.useState<'pending' | 'disabled'>()
    const [releaseStatusState, setReleaseStatus] = React.useState<'pending' | 'disabled'>()

    const onPrepare = async () => {
        try {
            setPrepareStatus('pending')
            await transfer.prepareTonToEvm(() => {
                setPrepareStatus('disabled')
            })
        }
        catch (e) {
            setPrepareStatus('disabled')
        }
    }

    const onRelease = async () => {
        try {
            setReleaseStatus('pending')
            await transferStatus.release(() => {
                setReleaseStatus('disabled')
            })
        }
        catch (e) {
            setReleaseStatus('disabled')
        }
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__statuses">
                <Observer>
                    {() => (
                        <div className="crosschain-transfer__status">
                            <div className="crosschain-transfer__status-label">
                                <StatusIndicator
                                    status={transferStatus.prepared
                                        ? 'confirmed'
                                        : (prepareStatusState || 'disabled')}
                                >
                                    {(() => {
                                        switch (true) {
                                            case transferStatus.prepared:
                                                return 'Confirmed'

                                            case prepareStatusState === 'pending':
                                                return 'Pending'

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
                                    disabled={transferStatus.prepared || prepareStatusState === 'pending'}
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
                                    status={transferStatus.releaseState
                                        ? 'confirmed'
                                        : (releaseStatusState || 'disabled')}
                                >
                                    {(() => {
                                        switch (true) {
                                            case transferStatus.releaseState === 'confirmed':
                                                return 'Confirmed'

                                            case transferStatus.releaseState === 'pending':
                                            case releaseStatusState === 'pending':
                                                return 'Pending'

                                            default:
                                                return 'Awaiting'
                                        }
                                    })()}
                                </StatusIndicator>
                            </div>
                            <div className="crosschain-transfer__status-control">
                                <p>
                                    Release transfer in Ethereum
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-s btn--primary"
                                    disabled={
                                        transferStatus.prepared === undefined
                                        || transferStatus.eventState?.status !== 'confirmed'
                                        || transferStatus.releaseState === 'pending'
                                        || transferStatus.releaseState === 'confirmed'
                                        || releaseStatusState === 'pending'
                                    }
                                    onClick={onRelease}
                                >
                                    Release
                                </button>
                            </div>
                        </div>
                    )}
                </Observer>
            </div>
        </div>
    )
}
