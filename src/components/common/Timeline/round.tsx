import * as React from 'react'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    title?: string;
    link?: string;
    length: number;
    maxLength: number;
}

export function Round({
    title,
    link,
    length,
    maxLength,
}: Props): JSX.Element {
    const width = (100 / maxLength) * length

    return (
        <div
            className="timeline-round"
            style={{
                width: `${width}%`,
            }}
        >
            <div className="timeline-round__title">
                {link ? (
                    <Link to={link} className="timeline-round__link">
                        {title}
                        <Icon icon="right" />
                    </Link>
                ) : title}
            </div>
        </div>
    )
}
