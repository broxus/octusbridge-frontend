import * as React from 'react'

import './index.scss'

type Props = {
    label?: React.ReactNode;
    children: React.ReactNode;
}

export function Value({
    label,
    children,
}: Props): JSX.Element {
    return (
        <div className="table-value">
            {children}
            {label && (
                <div className="table-value__label">
                    {label}
                </div>
            )}
        </div>
    )
}
