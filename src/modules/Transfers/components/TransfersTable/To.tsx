import * as React from 'react'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { Status } from '@/modules/Transfers/components/TransfersTable/Status'
import { type Transfer } from '@/modules/Transfers/types'
import { getToAddress, getToNetwork } from '@/modules/Transfers/utils'

import './index.scss'

type Props = {
    transfer: Transfer;
}

export function To({
    transfer,
}: Props): JSX.Element {
    const intl = useIntl()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const toAddress = getToAddress(transfer)
    const toNetwork = getToNetwork(transfer)

    const showTransitStatus = ['AlienEthToEth', 'NativeEthToEth'].includes(transfer.transferKind)
        && (transfer.ethTonStatus !== 'Confirmed' || transfer.tonEthStatus !== 'Confirmed')

    return (
        <>
            {toNetwork && toNetwork.name && (
                <div className="transfers-table-name">
                    {toNetwork.name}
                </div>
            )}

            <div className="transfers-table-data">
                {/* eslint-disable no-nested-ternary */}
                {toNetwork && toAddress ? (
                    toNetwork.type === 'evm' ? (
                        <BlockScanAddressLink
                            copy
                            address={toAddress}
                            baseUrl={toNetwork.explorerBaseUrl}
                            explorerLabel={toNetwork.explorerLabel ?? ''}
                        />
                    ) : (
                        <EverscanAccountLink
                            copy
                            address={toAddress}
                        />
                    )
                ) : (
                    noValue
                )}

                {showTransitStatus && (
                    <Status status={transfer.tonEthStatus} />
                )}
            </div>
        </>
    )
}
