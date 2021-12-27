import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    status?: 'waiting' | 'active' | 'success';
    disabled?: boolean;
    children?: React.ReactNode;
}

export function Block({
    status,
    disabled,
    children,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('timeline-block', {
                [`timeline-block_${status}`]: status !== undefined,
                'timeline-block_disabled': disabled !== undefined,
            })}
        >
            {children}
        </div>
    )
}
