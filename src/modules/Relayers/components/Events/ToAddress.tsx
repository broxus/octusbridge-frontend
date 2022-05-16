import * as React from 'react'
import { useIntl } from 'react-intl'

import { RelayersEvent } from '@/modules/Relayers/types'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { networks } from '@/config'

import './index.scss'

type Props = {
    item: RelayersEvent;
}

export function ToAddress({
    item,
}: Props): JSX.Element | null {
    const intl = useIntl()

    if (item.transferKind === 'ethtoton' && item.to) {
        return (
            <EverscanAccountLink
                copy
                address={item.to}
            />
        )
    }

    if (item.transferKind === 'tontoeth' && item.to) {
        const baseUrl = networks.find(network => (
            network.type === 'evm' && network.chainId === item.chainId.toString()
        ))?.explorerBaseUrl

        if (baseUrl) {
            return (
                <BlockScanAddressLink
                    copy
                    address={item.to}
                    baseUrl={baseUrl}
                />
            )
        }
    }

    return (
        <>
            {intl.formatMessage({
                id: 'NO_VALUE',
            })}
        </>
    )
}
