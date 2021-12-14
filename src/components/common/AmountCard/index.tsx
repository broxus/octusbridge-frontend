import * as React from 'react'

import { Amount } from '@/components/common/Amount'
import { TvlChange } from '@/components/common/TvlChange'
import './index.scss'

type Props = {
    value?: string;
    decimals?: number;
    changesDirection?: number;
    priceChange?: string;
}

export function AmountCard({
    value,
    decimals,
    changesDirection = 0,
    priceChange = '0',
}: Props): JSX.Element {
    return (
        <div className="amount-card">
            <div>
                <Amount
                    value={value}
                    decimals={decimals}
                />
            </div>
            <TvlChange
                changesDirection={changesDirection}
                priceChange={priceChange}
                size="small"
            />
        </div>
    )
}
