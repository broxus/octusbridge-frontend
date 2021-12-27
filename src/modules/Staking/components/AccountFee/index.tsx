import * as React from 'react'
import { useIntl } from 'react-intl'

import { formattedAmount } from '@/utils'

import './index.scss'

type Props = {
    feeAmount?: string;
    tokenSymbol?: string;
    tokenDecimals?: number;
}

export function AccountFee({
    feeAmount,
    tokenSymbol,
    tokenDecimals,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="staking-account-fee">
            <div className="staking-account-fee__stats">
                <span>
                    {intl.formatMessage({
                        id: 'STAKING_ACCOUNT_FORM_STATS_FEE',
                    })}
                </span>
                <span>
                    {
                        tokenDecimals !== undefined && tokenSymbol && feeAmount
                            ? intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: formattedAmount(feeAmount, tokenDecimals),
                                symbol: tokenSymbol,
                            })
                            : intl.formatMessage({
                                id: 'NO_VALUE',
                            })
                    }
                </span>
            </div>

            <div className="staking-account-fee__hint">
                {intl.formatMessage({
                    id: 'STAKING_ACCOUNT_FORM_HINT',
                })}
            </div>
        </div>
    )
}
