import * as React from 'react'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useTvmSolanaPipelineContext } from '@/modules/Bridge/providers'
import { isEverscaleAddressValid } from '@/utils'


function ReleaseStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useTvmSolanaPipelineContext()

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isEverscaleAddressValid(transfer.contractAddress.toString())
    )
    const solanaWallet = transfer.useSolanaWallet
    const isPrepareConfirmed = transfer.prepareState?.status === 'confirmed'
    const status = transfer.releaseState?.status || 'disabled'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const waitingWallet = (
        !solanaWallet.isReady
        && isPrepareConfirmed
        && !isConfirmed
        && !isPending
    )

    const onRelease = async () => {
        if (
            !isTransferPage
            || (
                transfer.releaseState !== undefined
                && ['confirmed', 'pending'].includes(transfer.releaseState.status)
            )
        ) {
            return
        }

        await transfer.release()
    }

    return (
        <ReleaseStatus
            isReleased={transfer.releaseState?.isReleased}
            status={status}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: bridge.rightNetwork?.label || transfer.rightNetwork?.label || '',
            })}
            waitingWallet={waitingWallet}
        >
            {(() => {
                if (solanaWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <Button
                            disabled={solanaWallet.isConnecting || solanaWallet.isConnected}
                            type="primary"
                            onClick={solanaWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'SOLANA_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                const start = DateTime.now()
                const end = DateTime.fromSeconds((transfer.releaseState?.ttl ?? start.toSeconds()))
                const diff = end.diff(start, ['days', 'hours', 'minutes', 'seconds']).toObject()
                let isExpired = false
                if (isPrepareConfirmed && transfer.releaseState?.ttl !== undefined) {
                    isExpired = (
                        (diff.days ?? 0) <= 0
                        && (diff.hours ?? 0) <= 0
                        && (diff.minutes ?? 0) <= 0
                        && (diff.seconds ?? 0) <= 0
                    )
                }
                const disabled = !isTransferPage || (
                    !isPrepareConfirmed
                    || !isDisabled
                    || isConfirmed
                    || isPending
                    || isExpired
                )

                return (
                    <>
                        {(!disabled && transfer.releaseState?.ttl !== undefined) && (
                            <Alert
                                key="warning"
                                className="margin-bottom"
                                text={intl.formatMessage({
                                    // eslint-disable-next-line no-nested-ternary
                                    id: (diff.days && diff.hours)
                                        ? 'CROSSCHAIN_TRANSFER_CONFIRMATION_ALERT'
                                        // eslint-disable-next-line no-nested-ternary
                                        : (!diff.days && diff.hours)
                                            ? 'CROSSCHAIN_TRANSFER_CONFIRMATION_ALERT_MINUTES'
                                            : (!diff.days && !diff.hours && (diff.minutes || diff.seconds))
                                                ? 'CROSSCHAIN_TRANSFER_CONFIRMATION_ALERT_SECONDS'
                                                : 'CROSSCHAIN_TRANSFER_CONFIRMATION_ALERT',
                                }, {
                                    days: diff.days ?? 0,
                                    hours: diff.hours ?? 0,
                                    minutes: diff.minutes ?? 0,
                                    seconds: (diff.seconds ?? 0).toFixed(0),
                                }, { ignoreTag: true })}
                                type="warning"
                            />
                        )}

                        {isExpired && (
                            <Alert
                                key="expired"
                                className="margin-bottom"
                                text={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_CONFIRMATION_EXPIRED_ALERT',
                                })}
                                type="danger"
                            />
                        )}

                        {!isExpired && (
                            <Button
                                disabled={disabled}
                                type="primary"
                                onClick={(isTransferPage && !disabled) ? onRelease : undefined}
                            >
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_BTN_TEXT',
                                })}
                            </Button>
                        )}
                    </>
                )
            })()}
        </ReleaseStatus>
    )
}

export const ReleaseStatusIndicator = observer(ReleaseStatusIndicatorInner)
