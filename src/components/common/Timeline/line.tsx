import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    children?: React.ReactNode | React.ReactNodeArray;
    border?: boolean;
    indent?: boolean;
}

export function Line({
    children,
    border,
    indent,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('timeline__line', {
                timeline__line_border: border,
                timeline__line_indent: indent,
            })}
        >
            {children}
        </div>
    )
}
