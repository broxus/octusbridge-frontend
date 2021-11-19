import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export * from '@/components/common/Tabs/Tab'

type Props = {
    theme?: 'fill';
    children: React.ReactNode | React.ReactNodeArray;
}

export function Tabs({
    theme,
    children,
}: Props): JSX.Element {
    return (
        <ul
            className={classNames('tabs', {
                [`tabs_theme_${theme}`]: Boolean(theme),
            })}
        >
            {children}
        </ul>
    )
}
