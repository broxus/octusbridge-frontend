import * as React from 'react'

import './index.scss'

type Props = {
    top: number;
    left: number;
    children: React.ReactNode;
}

export function Tooltip({
    top,
    left,
    children,
}: Props): JSX.Element {
    return (
        <div
            className="pie-chart-tooltip"
            style={{
                transform: `translate(${left + 10}px, ${top + 10}px)`,
            }}
        >
            {children}
        </div>
    )
}
