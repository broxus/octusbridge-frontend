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
    truncate?: number;
    roundIfThousand?: boolean;
    preserve?: boolean;
}

export function TokenAmount({
    address,
    uri,
    symbol,
    amount,
    decimals,
    truncate,
    roundIfThousand,
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
                    value: formattedAmount(amount, decimals, {
                        preserve,
                        roundIfThousand,
                        // ignores if preserve or truncate are presented
                        target: 'token',
                        truncate,
                    }),
                    symbol,
                })}
            </span>
        </span>
    )
}
