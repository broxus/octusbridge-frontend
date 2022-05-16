import * as React from 'react'
import { useIntl } from 'react-intl'

import { TvlChange } from '@/components/common/TvlChange'
import { formattedAmount } from '@/utils'
import './index.scss'

type Props = {
    value?: string;
    decimals?: number;
    changesDirection?: number;
    priceChange?: string;
    showPriceChange?: boolean;
}

export function AmountCard({
    value,
    decimals,
    changesDirection = 0,
    priceChange = '0',
    showPriceChange = true,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="amount-card">
            <div>
                {value
                    ? formattedAmount(value, decimals, {
                        preserve: true,
                    })
                    : intl.formatMessage({
                        id: 'NO_VALUE',
                    })}
            </div>
            {showPriceChange && (
                <TvlChange
                    changesDirection={changesDirection}
                    priceChange={priceChange}
                    size="small"
                />
            )}
        </div>
    )
}
