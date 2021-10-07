import * as React from 'react'
import { useIntl } from 'react-intl'

import { sliceAddress } from '@/utils'


type Props = {
    address: string;
    baseUrl: string;
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
}


export function BlockScanAddressLink({
    address,
    baseUrl,
    children,
    className,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <a
            className={className}
            href={`${baseUrl}address/${address}`}
            title={intl.formatMessage({ id: 'OPEN_IN_ETHERSCAN' })}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children || sliceAddress(address)}
        </a>
    )
}
