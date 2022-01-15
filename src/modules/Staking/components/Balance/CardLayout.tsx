import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export * from '@/modules/Staking/components/Balance/FormLayout'

type Props = {
    title: string;
    desc?: React.ReactNode | string;
    theme: 'green' | 'red';
    children?: React.ReactNode;
}

export function CardLayout({
    title,
    desc,
    theme,
    children,
}: Props): JSX.Element {
    return (
        <div className={classNames('staking-card-layout', theme)}>
            <h3 className="staking-card-layout__title">
                {title}
            </h3>
            <div className="staking-card-layout__desc">
                {desc}
            </div>
            {children}
        </div>
    )
}
