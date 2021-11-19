import * as React from 'react'
import { useIntl } from 'react-intl'

import './index.scss'

type Props = {
    amount: number;
    total: number;
}

export function Rounds({
    amount,
    total,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="relayers-rounds">
            <div>
                {intl.formatMessage({
                    id: 'RELAYERS_ROUNDS_VALUE',
                }, {
                    amount,
                    total,
                })}
            </div>
            <div className="relayers-rounds__percent">
                {intl.formatMessage({
                    id: 'PERCENT',
                }, {
                    value: ((100 * amount) / total).toFixed(2),
                })}
            </div>
        </div>
    )
}
