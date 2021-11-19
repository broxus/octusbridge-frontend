import * as React from 'react'

import './index.scss'

type Props = {
    children: React.ReactNode | React.ReactNodeArray;
}

export function HeaderAction({
    children,
}: Props): JSX.Element {
    return (
        <div className="relayers-header-actions">
            {children}
        </div>
    )
}
