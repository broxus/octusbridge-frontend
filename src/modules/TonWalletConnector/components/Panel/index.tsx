import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export type PanelProps = {
    size?: 'md';
    children: React.ReactNode | React.ReactNodeArray;
}

export function Panel({
    size,
    children,
}: PanelProps): JSX.Element {
    return (
        <div
            className={classNames('card card--small card--flat connect-panel', {
                [`connect-panel_size_${size}`]: size !== undefined,
            })}
        >
            {children}
        </div>
    )
}
