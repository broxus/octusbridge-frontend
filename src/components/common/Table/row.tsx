import classNames from 'classnames';
import * as React from 'react'
import { Link } from 'react-router-dom'

import './index.scss'

type Props = {
    link?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export function Row({
    link,
    children,
    disabled,
}: Props): JSX.Element {
    if (link) {
        return (
            <Link
                to={link}
                className={classNames('list__row', {
                    'list__row--disabled': disabled,
                })}
            >
                {children}
            </Link>
        )
    }

    return (
        <div
            className={classNames('list__row', {
                'list__row--disabled': disabled,
            })}
        >
            {children}
        </div>
    )
}
