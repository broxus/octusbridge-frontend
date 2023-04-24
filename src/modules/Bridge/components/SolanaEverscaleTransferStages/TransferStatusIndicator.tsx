import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { TransferStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useSolanaEverscalePipelineContext } from '@/modules/Bridge/providers'
import { TransferStateStatus } from '@/modules/Bridge/types'
import { isSolanaTxSignatureValid } from '@/utils'


function TransferStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useSolanaEverscalePipelineContext()

    const [transferStatus, setTransferStatus] = React.useState<TransferStateStatus>('disabled')

    const isTransferPage = transfer.txSignature !== undefined && isSolanaTxSignatureValid(transfer.txSignature)
    const solanaWallet = isTransferPage ? transfer.useSolanaWallet : bridge.useSolanaWallet
    const status = isTransferPage ? (transfer.transferState?.status || 'disabled') : transferStatus
    const isConfirmed = status === 'confirmed'
    const isRejected = status === 'rejected'
    const isPending = status === 'pending'
    const { confirmedBlocksCount = 0, eventBlocksToConfirm = 0 } = { ...transfer.transferState }
    const waitingWallet = (
        !solanaWallet.isReady
        && !isConfirmed
        && !isPending
    )
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork

    const onTransfer = async () => {
        if (isTransferPage || transferStatus === 'pending') {
            return
        }

        try {
            setTransferStatus('pending')
            await bridge.depositSolana(() => {
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
            note={intl.formatMessage({
                id: 'CROSSCHAIN_TRANSFER_STATUS_TRANSFER_NOTE',
            }, {
                network: leftNetwork?.label || '',
            })}
            status={status}
            txHash={transfer.txSignature}
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
}

export const TransferStatusIndicator = observer(TransferStatusIndicatorInner)
