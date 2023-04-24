import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { TransferStatus } from '@/modules/Bridge/components/Statuses'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge, useEvmEverscalePipelineContext } from '@/modules/Bridge/providers'
import { type TransferStateStatus } from '@/modules/Bridge/types'
import { isEvmTxHashValid } from '@/utils'


export const TransferStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEvmEverscalePipelineContext()

    const [transferStatus, setTransferStatus] = React.useState<TransferStateStatus>('disabled')

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const evmWallet = isTransferPage ? transfer.useEvmWallet : bridge.useEvmWallet
    const status = isTransferPage ? (transfer.transferState?.status || 'disabled') : transferStatus
    const isConfirmed = status === 'confirmed'
    const isRejected = status === 'rejected'
    const isPending = status === 'pending'
    const { confirmedBlocksCount = 0, eventBlocksToConfirm = 0 } = { ...transfer.transferState }
    const waitingWallet = (
        !evmWallet.isReady
        && !isConfirmed
        && !isPending
    )
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
    const wrongNetwork = (
        evmWallet.isReady
        && leftNetwork !== undefined
        && !isEqual(leftNetwork?.chainId, evmWallet.chainId)
        && !isConfirmed
        && !isPending
    )

    const onTransfer = async (): Promise<void> => {
        if (isTransferPage || transferStatus === 'pending') {
            return
        }

        try {
            setTransferStatus('pending')
            if (bridge.isNativeEvmCurrency) {
                await bridge.depositNative(() => {
                    setTransferStatus('disabled')
                })
            }
            else if (bridge.isSwapEnabled) {
                await bridge.depositWithMultiSwap(() => {
                    setTransferStatus('disabled')
                })
            }
            else {
                await bridge.depositAlienMultiToken(() => {
                    setTransferStatus('disabled')
                })
            }
        }
        catch (e) {
            setTransferStatus('disabled')
        }
    }

    return (
        <TransferStatus
            confirmedBlocksCount={confirmedBlocksCount}
            eventBlocksToConfirm={eventBlocksToConfirm}
            isTransferPage={isTransferPage}
            network={leftNetwork}
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_NOTE',
            }, {
                network: leftNetwork?.name || '',
            })}
            status={status}
            txHash={transfer.txHash}
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
                            network={leftNetwork}
                            wallet={evmWallet}
                        />
                    )
                }

                return (
                    <Button
                        disabled={(
                            isTransferPage
                            || isPending
                            || isConfirmed
                            || isRejected
                        )}
                        type="primary"
                        onClick={!isTransferPage ? onTransfer : undefined}
                    >
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_BTN_TEXT',
                        })}
                    </Button>
                )
            })()}
        </TransferStatus>
    )
})
