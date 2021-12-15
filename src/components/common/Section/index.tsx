import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

export * from '@/components/common/Section/Header'
export * from '@/components/common/Section/Actions'
export * from '@/components/common/Section/Title'
export * from '@/components/common/Section/Container'
export * from '@/components/common/Section/Description'
export * from '@/components/common/Section/Line'

type Props = {
    id?: string;
    children: React.ReactNode;
    className?: string;
}

export function Section({
    id,
    children,
    className,
}: Props): JSX.Element {
    return (
        <div
            id={id}
            className={classNames('content-section', className)}
        >
            {children}
        </div>
    )
}
