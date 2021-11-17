import * as React from 'react'
import classNames from 'classnames'

import './index.scss'


interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    block?: boolean;
    size?: 'sm' | 'md' | 'lg';
    type?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'link' | 'icon';
}


export function Button({
    block,
    children,
    className,
    size,
    type,
    ...props
}: Props): JSX.Element {
    return (
        <button
            className={classNames('btn', {
                [`btn--${size}`]: size !== undefined,
                [`btn--${type}`]: type !== undefined,
                'btn--block': block,
            }, className)}
            {...props}
            type="button"
        >
            {children}
        </button>
    )
}
