import * as React from 'react'
import { useIntl } from 'react-intl'

import { DexConstants } from '@/misc'
import { formattedTokenAmount } from '@/utils'

import './index.scss'

type Props = {
    value?: string;
    percent?: number;
}

export function VoteCard({
    value,
    percent,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="vote-card">
            <div className="vote-card__value">
                {value
                    ? formattedTokenAmount(value, DexConstants.CoinDecimals)
                    : intl.formatMessage({
                        id: 'NO_VALUE',
                    })}
            </div>
            {percent && (
                <div className="vote-card__percent">
                    {percent}
                    %
                </div>
            )}
        </div>
    )
}
