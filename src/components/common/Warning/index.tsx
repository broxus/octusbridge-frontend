import * as React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import './index.scss'

type Props = {
    title?: string;
    text?: string;
    theme?: 'danger' | 'warning';
    actionLabel?: string;
    actionLink?: string;
}

export function Warning({
    title,
    text,
    theme = 'danger',
    actionLabel,
    actionLink,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('warning', {
                [`warning_theme_${theme}`]: Boolean(theme),
            })}
        >
            <div>
                {title && (
                    <h4 className="warning__title">{title}</h4>
                )}

                {text && (
                    <div className="warning__text" dangerouslySetInnerHTML={{ __html: text }} />
                )}
            </div>

            {actionLabel && actionLink && (
                <Link className="btn btn--empty btn-s" to={actionLink}>
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}
