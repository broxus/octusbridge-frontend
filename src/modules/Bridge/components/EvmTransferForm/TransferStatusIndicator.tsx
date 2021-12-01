import * as React from 'react'
import isEqual from 'lodash.isequal'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { TransferStatus } from '@/modules/Bridge/components/Statuses'
import { WalletsConnectors } from '@/modules/Bridge/components/WalletsConnectors'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge, useEvmTransfer } from '@/modules/Bridge/providers'
import { TransferStateStatus } from '@/modules/Bridge/types'
import { isEvmTxHashValid } from '@/utils'


function TransferStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useEvmTransfer()

    const [transferStatus, setTransferStatus] = React.useState<TransferStateStatus>('disabled')

    const isTransferPage = transfer.txHash !== undefined && isEvmTxHashValid(transfer.txHash)
    const evmWallet = isTransferPage ? transfer.useEvmWallet : bridge.useEvmWallet
    const tonWallet = isTransferPage ? transfer.useTonWallet : bridge.useTonWallet
    const status = isTransferPage ? (transfer.transferState?.status || 'disabled') : transferStatus
    const isConfirmed = status === 'confirmed'
    const isRejected = status === 'rejected'
    const isPending = status === 'pending'
    const { confirmedBlocksCount = 0, eventBlocksToConfirm = 0 } = { ...transfer.transferState }
    const waitingWallet = (
        (!evmWallet.isReady || !tonWallet.isReady)
        && !isConfirmed
    )
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
    const wrongNetwork = (
        evmWallet.isReady
        && leftNetwork !== undefined
        && !isEqual(leftNetwork?.chainId, evmWallet.chainId)
        && !isConfirmed
    )

    const onTransfer = async () => {
        if (isTransferPage || transferStatus === 'pending') {
            return
        }

        try {
            setTransferStatus('pending')
            await bridge.transfer(() => {
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
            txHash={transfer.txHash}
            waitingWallet={waitingWallet}
            wrongNetwork={wrongNetwork}
        >
            {(() => {
                if (evmWallet.isInitializing || tonWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <WalletsConnectors
                            evmWallet={evmWallet}
                            tonWallet={tonWallet}
                        />
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
}

export const TransferStatusIndicator = observer(TransferStatusIndicatorInner)
