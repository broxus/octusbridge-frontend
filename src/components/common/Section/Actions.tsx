import * as React from 'react'

import './index.scss'

type Props = {
    children: React.ReactNode;
}

export function Actions({
    children,
}: Props): JSX.Element {
    return (
        <div className="content-section-actions">
            {children}
        </div>
    )
}
