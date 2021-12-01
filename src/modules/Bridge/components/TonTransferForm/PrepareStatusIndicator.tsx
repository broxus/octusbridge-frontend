import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { PrepareStatus } from '@/modules/Bridge/components/Statuses'
import { useBridge, useTonTransfer } from '@/modules/Bridge/providers'
import { PrepareStateStatus } from '@/modules/Bridge/types'
import { isTonAddressValid } from '@/utils'


function PrepareStatusIndicatorInner(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const transfer = useTonTransfer()

    const [prepareStatus, setPrepareStatus] = React.useState<PrepareStateStatus>('disabled')

    const isTransferPage = (
        transfer.contractAddress !== undefined
        && isTonAddressValid(transfer.contractAddress.toString())
    )
    const tonWallet = isTransferPage ? transfer.useTonWallet : bridge.useTonWallet
    const status = isTransferPage ? (transfer.prepareState?.status || 'disabled') : prepareStatus
    const isConfirmed = status === 'confirmed'
    const isPending = status === 'pending'
    const leftNetwork = isTransferPage ? transfer.leftNetwork : bridge.leftNetwork
    const waitingWallet = !tonWallet.isReady && !isConfirmed

    const onPrepare = async () => {
        if (isTransferPage || prepareStatus === 'pending') {
            return
        }

        try {
            setPrepareStatus('pending')
            await bridge.prepareTonToEvm(() => {
                setPrepareStatus('disabled')
            })
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
                if (tonWallet.isInitializing) {
                    return null
                }

                if (waitingWallet) {
                    return (
                        <Button
                            disabled={tonWallet.isConnecting || tonWallet.isConnected}
                            type="primary"
                            onClick={tonWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )
                }

                return (
                    <Button
                        disabled={(
                            isTransferPage
                            || !tonWallet.isReady
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
}

export const PrepareStatusIndicator = observer(PrepareStatusIndicatorInner)

