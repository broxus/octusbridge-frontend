import classNames from 'classnames';
import * as React from 'react'

import './index.scss'

type Props = {
    indent?: 'lg';
    children: React.ReactNode;
}

export function Description({
    indent,
    children,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('content-section-description', {
                [`content-section-description_indent_${indent}`]: indent !== undefined,
            })}
        >
            {children}
        </div>
    )
}
