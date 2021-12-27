import * as React from 'react'

import './index.scss'

type Props = {
    length: number;
    maxLength: number;
}

export function Counter({
    length,
    maxLength,
}: Props): JSX.Element {
    return (
        <div className="counter">
            {length}
            /
            {maxLength}
        </div>
    )
}
