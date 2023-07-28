import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { TransferStatus } from '@/modules/Bridge/components/Statuses'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge, useEvmEvmPipelineContext } from '@/modules/Bridge/providers'
import { type TransferStateStatus } from '@/modules/Bridge/types'
import { isEvmTxHashValid } from '@/utils'

export const TransferStatusIndicator = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEvmEvmPipelineContext()

    const [transferStatus, setTransferStatus] = React.useState<TransferStateStatus>('disabled')

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const evmWallet = isTransferPage ? transfer.evmWallet : bridge.evmWallet
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork

    const status = isTransferPage ? transfer.transferState?.status ?? 'disabled' : transferStatus
    const isConfirmed = status === 'confirmed'
    const isRejected = status === 'rejected'
    const isPending = status === 'pending'
    const { confirmedBlocksCount = 0, eventBlocksToConfirm = 0 } = { ...transfer.transferState }

    const waitingWallet = !isTransferPage && !evmWallet.isReady && !isConfirmed && !isPending
    const wrongNetwork = !isTransferPage && (
        evmWallet.isReady
        && leftNetwork !== undefined
        && leftNetwork?.chainId !== evmWallet.chainId
        && !isConfirmed
        && !isPending
    )

    const onTransfer = async (): Promise<void> => {
        if (isTransferPage || transferStatus === 'pending') {
            return
        }

        try {
            setTransferStatus('pending')
            await bridge.prepareTransit(() => {
                setTransferStatus('disabled')
            })
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
            note={intl.formatMessage(
                {
                    id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_NOTE',
                },
                {
                    network: leftNetwork?.name || '',
                },
            )}
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
                    return <WrongNetworkError className="margin-bottom" network={leftNetwork} wallet={evmWallet} />
                }

                return (
                    <Button
                        disabled={isTransferPage || isPending || isConfirmed || isRejected}
                        type="primary"
                        onClick={(!isTransferPage && bridge.isAssetValid) ? onTransfer : undefined}
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
