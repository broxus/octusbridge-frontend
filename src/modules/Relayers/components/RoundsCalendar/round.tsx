import * as React from 'react'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    title?: string;
    link?: string;
}

export function Round({
    title,
    link,
}: Props): JSX.Element {
    return (
        <div className="rounds-calendar-round">
            <div className="rounds-calendar-round__title">
                {link ? (
                    <Link to={link} className="rounds-calendar-round__link">
                        {title}
                        <Icon icon="right" />
                    </Link>
                ) : title}
            </div>
        </div>
    )
}
