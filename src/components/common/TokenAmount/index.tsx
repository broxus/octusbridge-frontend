import * as React from 'react'
import { useIntl } from 'react-intl'

import { TokenIcon } from '@/components/common/TokenIcon'
import { formattedTokenAmount } from '@/utils'

import './index.scss'

type Props = {
    address: string;
    uri?: string;
    symbol?: string;
    amount?: string;
    decimals?: number;
    truncate?: number;
    roundOn?: boolean;
    preserve?: boolean;
}

export function TokenAmount({
    address,
    uri,
    symbol,
    amount,
    decimals,
    truncate,
    roundOn,
    preserve,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <span className="token-amount">
            <TokenIcon
                address={address}
                uri={uri}
                size="small"
            />
            <span>
                {intl.formatMessage({
                    id: 'AMOUNT',
                }, {
                    value: formattedTokenAmount(amount, decimals, {
                        preserve,
                        roundOn,
                        truncate,
                    }),
                    symbol,
                })}
            </span>
        </span>
    )
}
