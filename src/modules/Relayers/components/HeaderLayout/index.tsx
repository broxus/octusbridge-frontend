import * as React from 'react'

import './index.scss'

export * from '@/modules/Relayers/components/HeaderLayout/Actions'
export * from '@/modules/Relayers/components/HeaderLayout/ExternalLinkIcon'

type Props = {
    children: React.ReactNode | React.ReactNodeArray;
}

export function HeaderLayout({
    children,
}: Props): JSX.Element {
    return (
        <div className="relayers-header-layout">
            {children}
        </div>
    )
}
