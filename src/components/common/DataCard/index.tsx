import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    title?: string;
    hint?: string;
    value?: number | string | null;
    linkUrl?: string;
    linkTitle?: string;
    children?: React.ReactNode | React.ReactNode[];
}

export function DataCard({
    title,
    hint,
    value,
    linkUrl,
    linkTitle,
    children,
}: Props): JSX.Element {
    const intl = useIntl()

    const _link = linkUrl && linkTitle && (
        <Link to={linkUrl} className="data-card__link">
            {linkTitle}
            <Icon icon="right" />
        </Link>
    )

    return (
        <div className="card card--flat data-card">
            {title && (
                <div className="data-card__title">
                    {title}
                </div>
            )}

            {value !== undefined && (
                <div className="data-card__value">
                    {value ?? intl.formatMessage({
                        id: 'NO_VALUE',
                    })}
                </div>
            )}

            <div className="data-card__body">
                {children && (
                    <div className="data-card__content">
                        {children}
                        {!hint && _link}
                    </div>
                )}

                {hint && (
                    <div className="data-card__content data-card__content_hint">
                        {hint}
                        {_link}
                    </div>
                )}

                {!children && !hint && _link && (
                    <div className="data-card__content data-card__content_link">
                        {_link}
                    </div>
                )}
            </div>
        </div>
    )
}
