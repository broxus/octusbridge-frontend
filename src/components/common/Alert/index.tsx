import * as React from 'react'
import classNames from 'classnames'

import './index.scss'


type Props = {
    actions?: React.ReactNode;
    className?: string;
    text?: string;
    title?: string;
    type?: 'danger' | 'warning';
}


export function Alert({
    actions,
    className,
    title,
    text,
    type,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('alert', {
                [`alert--${type}`]: type !== undefined,
            }, className)}
        >
            <div>
                {title && (
                    <h4 className="alert__title">
                        {title}
                    </h4>
                )}

                {text && (
                    <div
                        className="alert__text"
                        dangerouslySetInnerHTML={{
                            __html: text,
                        }}
                    />
                )}
            </div>

            {actions}

            {/*
            {actionLabel && actionLink && (
                <Link
                    className="btn btn--tertiary btn--sm"
                    to={actionLink}
                >
                    {actionLabel}
                </Link>
            )}
            */}
        </div>
    )
}
