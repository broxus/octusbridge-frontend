import * as React from 'react'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { Status } from '@/modules/Transfers/components/TransfersTable/Status'
import { getFromAddress, getFromNetwork } from '@/modules/Transfers/utils'
import { Transfer } from '@/modules/Transfers/types'

import './index.scss'

type Props = {
    transfer: Transfer;
}

export function From({
    transfer,
}: Props): JSX.Element {
    const intl = useIntl()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fromAddress = getFromAddress(transfer)
    const fromNetwork = getFromNetwork(transfer)

    const showTransitStatus = transfer.transferKind === 'EthToEth'
        && (transfer.ethTonStatus !== 'Confirmed' || transfer.tonEthStatus !== 'Confirmed')

    return (
        <>
            {fromNetwork && fromNetwork.name && (
                <div className="transfers-table-name">
                    {fromNetwork.name}
                </div>
            )}

            <div className="transfers-table-data">
                {/* eslint-disable no-nested-ternary */}
                {fromAddress && fromNetwork ? (
                    fromNetwork.type === 'evm' ? (
                        <BlockScanAddressLink
                            copy
                            address={fromAddress}
                            baseUrl={fromNetwork.explorerBaseUrl}
                        />
                    ) : (
                        <EverscanAccountLink
                            copy
                            address={fromAddress}
                        />
                    )
                ) : (
                    noValue
                )}

                {showTransitStatus && (
                    <Status status={transfer.ethTonStatus} />
                )}
            </div>
        </>
    )
}
