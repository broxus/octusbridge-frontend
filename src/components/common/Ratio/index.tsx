import * as React from 'react'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'

import './index.scss'

export enum RatioStatus {
    Success = 'success',
    Warning = 'warning',
    Fail = 'fail',
}

type Props = {
    value: number;
    total: number;
    status?: RatioStatus;
}

export function Ratio({
    value,
    total,
    status,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('ratio', {
                [`${status}`]: status !== undefined,
            })}
        >
            <div>
                {value}
                /
                {total}
            </div>
            <div className="ratio__percent">
                {(new BigNumber(value).eq(0) || new BigNumber(total).eq(0)) ? (
                    '0'
                ) : (
                    new BigNumber(value)
                        .times(100)
                        .dividedBy(total)
                        .dp(2)
                        .toFixed()
                )}
                %
            </div>
        </div>
    )
}
