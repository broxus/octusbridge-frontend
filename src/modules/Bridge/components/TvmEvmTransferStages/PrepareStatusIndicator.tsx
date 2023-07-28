import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useTvmEvmPipelineContext } from '@/modules/Bridge/providers'
import { type PrepareStateStatus } from '@/modules/Bridge/types'
import { isEverscaleAddressValid } from '@/utils'

export const PrepareStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useTvmEvmPipelineContext()

    const [prepareStatus, setPrepareStatus] = React.useState<PrepareStateStatus>('disabled')

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isEverscaleAddressValid(transfer.contractAddress.toString())
    )
    const everWallet = isTransferPage ? transfer.tvmWallet : bridge.tvmWallet
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork

    const status = isTransferPage ? (transfer.prepareState?.status || 'disabled') : prepareStatus
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'

    const waitingWallet = !isTransferPage && (
        !everWallet.isReady
        && !isConfirmed
        && !isPending
        && !isTransferPage
    )

    const onReject: VoidFunction = () => {
        setPrepareStatus('disabled')
    }

    const onPrepare = async (): Promise<void> => {
        if (isTransferPage || prepareStatus === 'pending') {
            return
        }

        try {
            setPrepareStatus('pending')

            if (bridge.isNativeTvmCurrency) {
                if (bridge.isEnoughWeverBalance) {
                    await bridge.transferTvmNativeToken(onReject)
                }
                else if (bridge.isEnoughEverBalance) {
                    await bridge.wrapTvmNativeCurrency(onReject)
                }
                else if (bridge.isEnoughComboBalance) {
                    await bridge.transferTvmNativeCombination(onReject)
                }
            }
            else if (bridge.pipeline?.isNative === false) {
                await bridge.burnTvmAlienToken(onReject)
            }
            else if (bridge.pipeline?.isNative === true) {
                await bridge.transferTvmNativeToken(onReject)
            }
        }
        catch (e) {
            setPrepareStatus('disabled')
        }
    }

    return (
        <PrepareStatus
            isDeploying={transfer.contractAddress === undefined && status === 'pending'}
            isTransferPage={isTransferPage}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_NOTE',
            }, {
                network: leftNetwork?.name || '',
            })}
            status={status}
            txHash={transfer.contractAddress?.toString()}
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

                return (
                    <Button
                        disabled={(
                            isTransferPage
                            || !everWallet.isReady
                            || isPending
                            || isConfirmed
                        )}
                        type="primary"
                        onClick={!isTransferPage ? onPrepare : undefined}
                    >
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_PREPARE_BTN_TEXT',
                        })}
                    </Button>
                )
            })()}
        </PrepareStatus>
    )
})
