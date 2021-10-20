import * as React from 'react'
import { useIntl } from 'react-intl'

import './index.scss'

type Props = {
    feeAmount?: string;
    feeSymbol?: string;
}

export function AccountFee({
    feeAmount = '12.50',
    feeSymbol = 'TON',
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
                    {intl.formatMessage({
                        id: 'AMOUNT',
                    }, {
                        value: feeAmount,
                        symbol: feeSymbol,
                    })}
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
