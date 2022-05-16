import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    status?: 'waiting' | 'active' | 'success';
    children: React.ReactNode;
}

export function Block({
    status,
    children,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('rounds-calendar-block', {
                [`rounds-calendar-block_${status}`]: Boolean(status),
            })}
        >
            {children}
        </div>
    )
}
