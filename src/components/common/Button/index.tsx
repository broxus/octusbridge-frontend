import * as React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import './index.scss'


export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    block?: boolean;
    size?: 'sm' | 'md' | 'lg';
    type?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'dark' | 'link' | 'icon' | 'accept';
    link?: string;
    href?: string;
    submit?: boolean;
}


export function Button({
    block,
    children,
    className,
    size,
    type,
    link,
    href,
    submit,
    ...props
}: ButtonProps): JSX.Element {
    const _className = classNames('btn', {
        [`btn--${size}`]: size !== undefined,
        [`btn--${type}`]: type !== undefined,
        'btn--block': block,
    }, className)

    if (link) {
        return (
            <Link
                to={link}
                className={_className}
            >
                {children}
            </Link>
        )
    }

    if (href) {
        return (
            <a
                className={_className}
                href={href}
                target="_blank"
                rel="nofollow noopener noreferrer"
            >
                {children}
            </a>
        )
    }

    return (
        <button
            className={_className}
            {...props}
            type={submit ? 'submit' : 'button'}
        >
            {children}
        </button>
    )
}
