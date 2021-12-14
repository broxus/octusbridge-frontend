import * as React from 'react'
import { Link } from 'react-router-dom'

import './index.scss'

type Props = {
    link?: string;
    children: React.ReactNode;
}

export function Row({
    link,
    children,
}: Props): JSX.Element {
    if (link) {
        return (
            <Link className="list__row" to={link}>
                {children}
            </Link>
        )
    }

    return (
        <div className="list__row">
            {children}
        </div>
    )
}
