import * as React from 'react'

import { TokenIcon, TokenIconProps } from '@/components/common/TokenIcon'

import './index.scss'

type Props = {
    address: string;
    uri?: string;
    symbol: string;
    size?: TokenIconProps['size'];
}

export function TokenBadge({
    address,
    uri,
    symbol,
    size,
}: Props): JSX.Element {
    return (
        <span className="events-token">
            <TokenIcon
                address={address}
                size={size}
                uri={uri}
            />

            {symbol}
        </span>
    )
}
