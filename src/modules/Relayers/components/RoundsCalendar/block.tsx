import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    length: number;
    maxLength: number;
    status?: 'waiting' | 'active' | 'success';
    children: React.ReactNode;
}

export function Block({
    length,
    maxLength,
    status,
    children,
}: Props): JSX.Element {
    const width = (100 / maxLength) * length

    return (
        <div
            className={classNames('rounds-calendar-block', {
                [`rounds-calendar-block_${status}`]: Boolean(status),
            })}
            style={{
                width: `${width}%`,
            }}
        >
            {children}
        </div>
    )
}
