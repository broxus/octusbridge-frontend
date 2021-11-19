import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { UserAvatar } from '@/components/common/UserAvatar'
import { Badge } from '@/components/common/Badge'
import { dateFormat, dateRelative } from '@/utils'

import './index.scss'

type Props = {
    address: string;
    title: string;
    startTime: number;
    endTime?: number;
    size?: 'lg';
}

export function RoundCard({
    address,
    title,
    startTime,
    endTime,
    size,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div
            className={classNames('round-card', {
                [`round-card_size_${size}`]: size !== undefined,
            })}
        >
            <UserAvatar address={address} />

            <div>
                <h3 className="round-card__title">{title}</h3>

                <div className="round-card__meta">
                    <Badge status="success">Active</Badge>

                    {startTime && endTime ? (
                        intl.formatMessage({
                            id: 'ROUND_INFO_DATE_PERIOD',
                        }, {
                            start: dateFormat(startTime),
                            end: dateFormat(endTime),
                        })
                    ) : (
                        dateFormat(startTime)
                    )}

                    {endTime && (
                        <span className="text-muted">
                            {intl.formatMessage({
                                id: 'ROUND_INFO_DAY_LEFT',
                            }, {
                                value: dateRelative(endTime),
                            })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
