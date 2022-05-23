import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { Icon } from '@/components/common/Icon'

import './index.scss'

export enum DataCardStatus {
    Success = 'success',
    Warning = 'warning',
    Fail = 'fail',
}

type Props = {
    title?: string;
    hint?: string;
    value?: React.ReactNode | number | string | null;
    linkUrl?: string;
    linkTitle?: string;
    children?: React.ReactNode | React.ReactNode[];
    status?: DataCardStatus;
}

export function DataCard({
    title,
    hint,
    value,
    linkUrl,
    linkTitle,
    children,
    status,
}: Props): JSX.Element {
    const intl = useIntl()

    const _link = linkUrl && linkTitle && (
        <Link to={linkUrl} className="data-card__link">
            {linkTitle}
            <Icon icon="right" />
        </Link>
    )

    return (
        <div
            className={classNames('card card--flat data-card', {
                [`${status}`]: status !== undefined,
            })}
        >
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

            {(children || hint || _link) && (
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
            )}
        </div>
    )
}
