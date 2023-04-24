import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useEverscaleEvmPipelineContext } from '@/modules/Bridge/providers'
import { type PrepareStateStatus } from '@/modules/Bridge/types'
import { isEverscaleAddressValid } from '@/utils'

export const PrepareStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEverscaleEvmPipelineContext()

    const [prepareStatus, setPrepareStatus] = React.useState<PrepareStateStatus>('disabled')

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isEverscaleAddressValid(transfer.contractAddress.toString())
    )
    const everWallet = isTransferPage ? transfer.useEverWallet : bridge.useEverWallet
    const status = isTransferPage ? (transfer.prepareState?.status || 'disabled') : prepareStatus
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
    const waitingWallet = !everWallet.isReady && !isConfirmed && !isPending

    const onPrepare = async (): Promise<void> => {
        if (isTransferPage || prepareStatus === 'pending') {
            return
        }

        try {
            setPrepareStatus('pending')
            const reject: VoidFunction = () => {
                setPrepareStatus('disabled')
            }

            if (bridge.pipeline?.isNative === false && bridge.isTokenChainSameToTargetChain) {
                await bridge.burnAlienToken(reject)
            }
            else if (bridge.isNativeEverscaleCurrency) {
                if (bridge.isEnoughWeverBalance) {
                    await bridge.transferNativeMultiToken(reject)
                }
                else if (bridge.isEnoughEverBalance) {
                    await bridge.wrapNative(reject)
                }
                else if (bridge.isEnoughComboBalance) {
                    await bridge.transferNative(reject)
                }
            }
            else if (bridge.pipeline?.isNative === true) {
                await bridge.transferNativeMultiToken(reject)
            }
            else {
                await bridge.prepareEverscaleToEvm(reject)
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
                network: leftNetwork?.label || '',
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
