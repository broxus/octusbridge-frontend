import * as React from 'react'
import { useIntl } from 'react-intl'

import { TokenIcon } from '@/components/common/TokenIcon'
import { formattedAmount } from '@/utils'

import './index.scss'

type Props = {
    address: string;
    uri?: string;
    symbol?: string;
    amount?: string;
    decimals?: number;
}

export function TokenAmount({
    address,
    uri,
    symbol,
    amount,
    decimals,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="token-amount">
            <TokenIcon
                address={address}
                uri={uri}
                size="small"
            />
            <span>
                {intl.formatMessage({
                    id: 'AMOUNT',
                }, {
                    value: formattedAmount(amount, decimals),
                    symbol,
                })}
            </span>
        </div>
    )
}
