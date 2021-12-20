import * as React from 'react'

import { Icon } from '@/components/common/Icon'
import './index.scss'

type Props = {
    title: string;
    children: React.ReactNode | React.ReactNodeArray;
}

export function Collapse({
    title,
    children,
}: Props): JSX.Element {
    const [contentVisible, setContentVisible] = React.useState(false)
    const toggle = () => setContentVisible(!contentVisible)

    return (
        <div className="collapse">
            <div
                className="collapse__name"
                onClick={toggle}
            >
                {title}

                <div className="collapse__icon">
                    <Icon icon={contentVisible ? 'up' : 'down'} />
                </div>
            </div>

            {contentVisible && (
                <div className="collapse__data">
                    {children}
                </div>
            )}
        </div>
    )
}
