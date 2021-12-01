import * as React from 'react'

import './index.scss'

type Props = {
    length: number;
    maxLength: number;
}

export function Cursor({
    length,
    maxLength,
}: Props): JSX.Element {
    const width = 100 / maxLength

    return (
        <div
            className="timeline-cursor"
            style={{
                width: `${width}%`,
                left: `${(length - 1) * width}%`,
            }}
        />
    )
}
