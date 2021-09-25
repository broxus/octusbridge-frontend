import * as React from 'react'
import classNames from 'classnames'

import './index.scss'


type Props = {
    children: React.ReactNode;
    status: 'confirmed' | 'pending' | 'disabled' | 'rejected';
}


export function StatusIndicator({ children, status }: Props): JSX.Element {
    return (
        <div
            className={classNames('status-indicator', {
                confirmed: status === 'confirmed',
                pending: status === 'pending',
                spinner: status === 'pending',
                disabled: status === 'disabled',
                rejected: status === 'rejected',
            })}
        >
            {children}
        </div>
    )
}
