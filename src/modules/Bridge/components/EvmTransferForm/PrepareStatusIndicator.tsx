import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useEvmTransfer } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork, isEvmTxHashValid } from '@/utils'


function PrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const everWallet = transfer.useEverWallet
    const status = transfer.prepareState?.status || 'disabled'
    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const waitingWallet = (
        !everWallet.isReady
        && isTransferConfirmed
        && !isConfirmed
        && !isPending
    )

    const onPrepare = async () => {
        if (
            !isTransferPage
            || (
                transfer.prepareState !== undefined
                && ['confirmed', 'pending'].includes(transfer.prepareState.status)
            )
        ) {
            return
        }

        await transfer.prepare()
    }

    const onDeployAlienRoot = async () => {
        await transfer.deployAlienRoot()
    }

    return (
        <PrepareStatus
            isDeployed={transfer.prepareState?.isDeployed}
            isDeploying={transfer.prepareState?.isDeploying}
            isTokenDeploying={transfer.prepareState?.isTokenDeploying}
            isTransferPage={isTransferPage}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
            }, {
                network: getEverscaleMainNetwork()?.label || '',
            })}
            status={status}
            txHash={isConfirmed ? transfer.deriveEventAddress?.toString() : undefined}
            waitingWallet={waitingWallet}
        >
            {(() => {
                if (everWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <Button
                            disabled={everWallet.isConnecting || everWallet.isConnected}
                            type="primary"
                            onClick={everWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                if (isTransferConfirmed && transfer.prepareState?.isTokenDeployed === false) {
                    return (
                        <Alert
                            actions={[
                                <Button
                                    key="deploy"
                                    size="md"
                                    type="tertiary"
                                    disabled={transfer.prepareState.isTokenDeploying}
                                    onClick={onDeployAlienRoot}
                                >
                                    Deploy
                                </Button>,
                            ]}
                            title={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_NOT_DEPLOYED_TITLE',
                            })}
                            text={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_NOT_DEPLOYED_TEXT',
                            }, {
                                blockchain: transfer.rightNetwork?.label || '',
                                symbol: transfer.token?.symbol || '',
                            }, { ignoreTag: true })}
                            type="warning"
                        />
                    )
                }

                return (
                    <Button
                        disabled={(!isTransferPage || (
                            !isTransferConfirmed
                            || !isDisabled
                            || isConfirmed
                            || isPending
                        ))}
                        type="primary"
                        onClick={isTransferPage ? onPrepare : undefined}
                    >
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                        })}
                    </Button>
                )
            })()}
        </PrepareStatus>
    )
}

export const PrepareStatusIndicator = observer(PrepareStatusIndicatorInner)
