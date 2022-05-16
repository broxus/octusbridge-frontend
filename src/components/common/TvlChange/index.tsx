import * as React from 'react'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'

import './style.scss'

export type TvlChangeProps = {
    hideZero?: boolean;
    changesDirection?: number | string;
    priceChange: number | string;
    size?: 'small';
    showPercent?: boolean;
}

export function TvlChange({
    hideZero,
    changesDirection = 0,
    priceChange,
    size,
    showPercent = true,
}: TvlChangeProps): JSX.Element {
    return (
        <div
            className={classNames('changes-direction', {
                'changes-direction_up': changesDirection > 0,
                'changes-direction_down': changesDirection < 0,
                [`changes-direction_${size}`]: Boolean(size),
            })}
        >
            {!hideZero ? (
                <>
                    {priceChange}
                    {showPercent && '%'}
                </>
            ) : (
                <>
                    {!new BigNumber(priceChange).isZero() ? (
                        <>
                            {priceChange}
                            {showPercent && '%'}
                        </>
                    ) : (
                        <>{'\u200B'}</>
                    )}
                </>
            )}
        </div>
    )
}
