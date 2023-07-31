import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { BountyForm } from '@/modules/Bridge/components/TvmEvmTransferStages/BountyForm'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge, useTvmEvmPipelineContext } from '@/modules/Bridge/providers'
import { isEverscaleAddressValid } from '@/utils'

export const ReleaseStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useTvmEvmPipelineContext()

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isEverscaleAddressValid(transfer.contractAddress.toString())
    )
    const evmWallet = isTransferPage ? transfer.evmWallet : bridge.evmWallet
    const tvmWallet = isTransferPage ? transfer.tvmWallet : bridge.tvmWallet
    const rightNetwork = isTransferPage ? transfer.rightNetwork : bridge.rightNetwork

    const isEventConfirmed = transfer.eventState?.status === 'confirmed'
    const status = transfer.releaseState?.status ?? (isEventConfirmed ? 'pending' : 'disabled')
    const isDisabled = !status || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const isOutdated = transfer.releaseState?.isOutdated === true
    const isReleased = transfer.releaseState?.isReleased === true

    // Check for expiring
    let isExpired = false

    const start = DateTime.now()
    const end = DateTime.fromSeconds((transfer.releaseState?.ttl ?? start.toSeconds()))
    const diff = end.diff(start, ['days', 'hours', 'minutes', 'seconds']).toObject()

    if (isEventConfirmed && transfer.releaseState?.ttl !== undefined) {
        isExpired = (
            (diff.days ?? 0) <= 0
            && (diff.hours ?? 0) <= 0
            && (diff.minutes ?? 0) <= 0
            && (diff.seconds ?? 0) <= 0
        )
    }

    const waitingWallet = (
        !evmWallet.isReady
        && isEventConfirmed
        && !isConfirmed
        && !isPending
        && !isExpired
    )
    const wrongNetwork = (
        evmWallet.isReady
        && rightNetwork !== undefined
        && rightNetwork.chainId !== evmWallet.chainId
        && isEventConfirmed
        && !isConfirmed
        && !isPending
        && !isExpired
    )

    const onRelease = async (): Promise<void> => {
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
            isReleased={isReleased}
            status={status}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_NOTE',
            }, {
                network: rightNetwork?.name || '',
            })}
            waitingWallet={waitingWallet}
            wrongNetwork={wrongNetwork}
        >
            {(() => {
                if (bridge.isSwapEnabled || evmWallet.isInitializing) {
                    return null
                }

                if (isTransferPage && !isEventConfirmed) {
                    return null
                }

                if (isTransferPage && transfer.isMultiVaultCredit && !isOutdated && !transfer.pendingWithdrawalId) {
                    return null
                }

                if (!isTransferPage && !bridge.isSwapEnabled) {
                    return (
                        <Button disabled type="primary">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                if (waitingWallet) {
                    return (
                        <Button
                            disabled={evmWallet.isConnecting || evmWallet.isConnected}
                            type="primary"
                            onClick={evmWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                if (
                    tvmWallet.isReady
                    && transfer.releaseState !== undefined
                    && transfer.isPendingWithdrawalSynced
                    && (transfer.pendingWithdrawalId || bridge.isInsufficientVaultBalance)
                ) {
                    return <BountyForm />
                }

                if (wrongNetwork) {
                    return <WrongNetworkError network={rightNetwork} wallet={evmWallet} />
                }

                const disabled = !isTransferPage || (
                    !isEventConfirmed
                    || !isDisabled
                    || isConfirmed
                    || isPending
                    || isExpired
                )

                if ((!isReleased ? isEventConfirmed : isDisabled) && !isPending && !isConfirmed) {
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
                }

                return null
            })()}
        </ReleaseStatus>
    )
})
