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
    truncate?: boolean;
    roundIfThousand?: boolean;
}

export function TokenAmount({
    address,
    uri,
    symbol,
    amount,
    decimals,
    truncate,
    roundIfThousand,
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
                    value: formattedAmount(amount, decimals, truncate, roundIfThousand),
                    symbol,
                })}
            </span>
        </span>
    )
}
