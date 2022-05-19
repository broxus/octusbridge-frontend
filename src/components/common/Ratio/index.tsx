import * as React from 'react'

import './index.scss'

type Props = {
    value: number;
    total: number;
}

export function Ratio({
    value,
    total,
}: Props): JSX.Element {
    return (
        <div className="ratio">
            <div>
                {value}
                /
                {total}
            </div>
            <div className="ratio__percent">
                {((100 * value) / total).toFixed(2)}
                %
            </div>
        </div>
    )
}
