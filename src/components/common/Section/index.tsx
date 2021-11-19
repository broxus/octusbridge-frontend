import * as React from 'react'

import './index.scss'

export * from '@/components/common/Section/Header'
export * from '@/components/common/Section/Actions'
export * from '@/components/common/Section/Title'

type Props = {
    children: React.ReactNode;
}

export function Section({
    children,
}: Props): JSX.Element {
    return (
        <div className="content-section">
            {children}
        </div>
    )
}
