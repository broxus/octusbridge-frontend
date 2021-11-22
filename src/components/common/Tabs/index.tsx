import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export * from '@/components/common/Tabs/Tab'

type Props = {
    theme?: 'fill';
    size?: 'lg';
    adaptive?: boolean;
    children: React.ReactNode | React.ReactNodeArray;
}

export function Tabs({
    theme,
    size,
    adaptive,
    children,
}: Props): JSX.Element {
    return (
        <ul
            className={classNames('tabs', {
                [`tabs_theme_${theme}`]: theme !== undefined,
                [`tabs_size_${size}`]: size !== undefined,
                tabs_adaptive: adaptive,
            })}
        >
            {children}
        </ul>
    )
}
