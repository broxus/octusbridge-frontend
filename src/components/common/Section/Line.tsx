import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    type?: 'light';
}

export function Line({
    type,
}: Props): JSX.Element {
    return (
        <hr
            className={classNames('content-section-line', {
                [`content-section-line_${type}`]: type !== undefined,
            })}
        />
    )
}
