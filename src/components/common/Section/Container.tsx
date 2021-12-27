import classNames from 'classnames'
import * as React from 'react'

import './index.scss'

type Props = {
    size?: 'sm' | 'lg';
    children: React.ReactNode;
}

export function Container({
    size,
    children,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('content-section-container', {
                [`content-section-container_size_${size}`]: size !== undefined,
            })}
        >
            {children}
        </div>
    )
}
