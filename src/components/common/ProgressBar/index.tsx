import * as React from 'react'

import './index.scss'

export type ProgressBarProps = {
    percent?: number;
    color?: 'red' | 'green';
    className?: string;
}

export function ProgressBar({
    percent = 0,
    color = 'green',
    className,
}: ProgressBarProps): JSX.Element {
    return (
        <div className={`progress-bar ${className}`}>
            <div
                className={`progress-bar__value progress-bar__value_${color}`}
                style={{
                    width: `${percent}%`,
                }}
            />
        </div>
    )
}
