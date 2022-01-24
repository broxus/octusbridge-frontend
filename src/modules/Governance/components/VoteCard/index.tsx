import * as React from 'react'
import { useIntl } from 'react-intl'

import { DexConstants } from '@/misc'
import { formattedAmount } from '@/utils'

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
                    ? formattedAmount(value, DexConstants.TONDecimals, {
                        target: 'token',
                    })
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
