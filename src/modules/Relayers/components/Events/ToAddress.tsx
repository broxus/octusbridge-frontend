import * as React from 'react'
import { useIntl } from 'react-intl'

import { type RelayersEvent } from '@/modules/Relayers/types'
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
        const network = networks.find(i => (
            i.type === 'evm' && i.chainId === item.chainId.toString()
        ))
        const baseUrl = network?.explorerBaseUrl

        if (baseUrl) {
            return (
                <BlockScanAddressLink
                    copy
                    address={item.to}
                    baseUrl={baseUrl}
                    explorerLabel={network.explorerLabel ?? ''}
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
