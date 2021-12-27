import * as React from 'react'

import './index.scss'

type Props = {
    children: React.ReactNode;
}

export function Description({
    children,
}: Props): JSX.Element {
    return (
        <div className="content-section-description">
            {children}
        </div>
    )
}
