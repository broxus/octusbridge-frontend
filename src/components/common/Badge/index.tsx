import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export type BadgeStatus = 'disabled' | 'enabled' | 'success' | 'warning' | 'fail';

type Props = {
    status?: BadgeStatus;
    className?: string;
    children: React.ReactNode;
}

export function Badge({
    status,
    className,
    children,
}: Props): JSX.Element | null {
    return (
        <div
            className={classNames('badge', className, {
                [`badge_${status}`]: Boolean(status),
            })}
        >
            {children}
        </div>
    )
}
