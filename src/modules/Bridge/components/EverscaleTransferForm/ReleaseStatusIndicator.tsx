import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { ReleaseStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
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
    const everWallet = transfer.useEverWallet
    const isEventConfirmed = transfer.eventState?.status === 'confirmed'
    const status = transfer.releaseState?.status || 'disabled'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const waitingWallet = (
        (!evmWallet.isReady || !everWallet.isReady)
        && isEventConfirmed
        && !isConfirmed
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && !isEqual(transfer.rightNetwork.chainId, evmWallet.chainId)
        && isEventConfirmed
        && !isConfirmed
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

    const onClickRelease = () => {
        onRelease()
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
                if (evmWallet.isInitializing || everWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <WalletsConnectors
                            evmWallet={evmWallet}
                            everWallet={everWallet}
                        />
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
                    && (transfer.pendingWithdrawalId || transfer.isVaultBalanceNotEnough)
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
