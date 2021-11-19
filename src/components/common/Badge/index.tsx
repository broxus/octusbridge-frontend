import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export type BadgeStatus = 'disabled' | 'enabled' | 'success' | 'warning' | 'fail';

type Props = {
    status?: BadgeStatus;
    children: React.ReactNode;
}

export function Badge({
    status,
    children,
}: Props): JSX.Element | null {
    return (
        <div
            className={classNames('badge', {
                [`badge_${status}`]: Boolean(status),
            })}
        >
            {children}
        </div>
    )
}
