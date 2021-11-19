import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    children: React.ReactNode;
    size?: 'lg';
}

export function Header({
    children,
    size,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('content-section-header', {
                [`content-section-header_size_${size}`]: size !== undefined,
            })}
        >
            {children}
        </div>
    )
}
