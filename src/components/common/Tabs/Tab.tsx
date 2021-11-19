import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    active?: boolean;
    children: React.ReactNode | React.ReactNodeArray;
    onClick?: () => void;
}

export function Tab({
    active,
    children,
    onClick,
}: Props): JSX.Element {
    return (
        <li
            className={classNames('tabs__item', {
                tabs__item_active: active,
            })}
            onClick={onClick}
        >
            {children}
        </li>
    )
}
