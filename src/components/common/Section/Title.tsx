import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    children: React.ReactNode;
    size?: 'lg';
}

export function Title({
    children,
    size,
}: Props): JSX.Element {
    return (
        <h2
            className={classNames('content-section-title', {
                [`content-section-title_size_${size}`]: size !== undefined,
            })}
        >
            {children}
        </h2>
    )
}
