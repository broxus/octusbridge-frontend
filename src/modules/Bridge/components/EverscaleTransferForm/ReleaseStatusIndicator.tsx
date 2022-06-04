import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { BountyForm } from '@/modules/Bridge/components/BountyForm'
import { useBridge, useEverscaleTransfer } from '@/modules/Bridge/providers'
import { isEverscaleAddressValid } from '@/utils'


function ReleaseStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()
    const transfer = useEverscaleTransfer()

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isEverscaleAddressValid(transfer.contractAddress.toString())
    )
    const evmWallet = transfer.useEvmWallet
    const isEventConfirmed = transfer.eventState?.status === 'confirmed'
    const status = transfer.releaseState?.status || 'disabled'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const waitingWallet = (
        !evmWallet.isReady
        && isEventConfirmed
        && !isConfirmed
        && !isPending
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && !isEqual(transfer.rightNetwork.chainId, evmWallet.chainId)
        && isEventConfirmed
        && !isConfirmed
        && !isPending
    )

    const onRelease = async (bounty?: string) => {
        if (
            !isTransferPage
            || (
                transfer.releaseState !== undefined
                && ['confirmed', 'pending'].includes(transfer.releaseState.status)
            )
        ) {
            return
        }

        await transfer.release(bounty)
    }

    const onSubmitBounty = async (amount: string) => {
        await transfer.submitBounty(amount)
    }

    const onClickRelease = async () => {
        await onRelease()
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
            wrongNetwork={wrongNetwork}
        >
            {(() => {
                if (evmWallet.isInitializing) {
                    return null
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

                if (wrongNetwork) {
                    return (
                        <WrongNetworkError
                            network={transfer.rightNetwork}
                            wallet={evmWallet}
                        />
                    )
                }

                if (
                    transfer.releaseState !== undefined
                    && transfer.isPendingWithdrawalSynced
                    && (transfer.pendingWithdrawalId || bridge.isInsufficientVaultBalance)
                ) {
                    return (
                        <BountyForm
                            onSubmit={transfer.pendingWithdrawalId
                                ? onSubmitBounty
                                : onRelease}
                        />
                    )
                }

                return (
                    <Button
                        disabled={(!isTransferPage || (
                            !isEventConfirmed
                            || !isDisabled
                            || isConfirmed
                            || isPending
                        ))}
                        type="primary"
                        onClick={isTransferPage ? onClickRelease : undefined}
                    >
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_RELEASE_BTN_TEXT',
                        })}
                    </Button>
                )
            })()}
        </ReleaseStatus>
    )
}

export const ReleaseStatusIndicator = observer(ReleaseStatusIndicatorInner)
