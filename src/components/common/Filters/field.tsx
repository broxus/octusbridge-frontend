import * as React from 'react'

import './index.scss'

type Props = {
    title: string;
    children: React.ReactNode | React.ReactNodeArray;
}

export function FilterField({
    title,
    children,
}: Props): JSX.Element {
    return (
        <div className="filters-field">
            <div className="filters-field__title">{title}</div>
            <div className="filters-field__inputs">
                {children}
            </div>
        </div>
    )
}
