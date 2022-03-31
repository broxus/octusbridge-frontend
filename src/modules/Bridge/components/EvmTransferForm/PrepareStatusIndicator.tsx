import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmTransfer } from '@/modules/Bridge/providers'
import { getEverscaleMainNetwork, isEvmTxHashValid } from '@/utils'


function PrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEvmTransfer()

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const evmWallet = transfer.useEvmWallet
    const everWallet = transfer.useEverWallet
    const status = transfer.prepareState?.status || 'disabled'
    const isTransferConfirmed = transfer.transferState?.status === 'confirmed'
    const isDisabled = status === undefined || status === 'disabled'
    const isConfirmed = status === 'confirmed'
    const waitingWallet = (
        (!evmWallet.isReady || !everWallet.isReady)
        && isTransferConfirmed
        && !isConfirmed
    )
    const wrongNetwork = (
        evmWallet.isReady
        && transfer.leftNetwork !== undefined
        && !isEqual(transfer.leftNetwork.chainId, evmWallet.chainId)
        && isTransferConfirmed
        && !isConfirmed
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
                            wallet={evmWallet}
                            network={transfer.leftNetwork}
                        />
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
