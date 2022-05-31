import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { UserAvatar } from '@/components/common/UserAvatar'
import { Badge, BadgeStatus } from '@/components/common/Badge'
import { dateFormat, dateRelative } from '@/utils'
import { getRoundStatus } from '@/modules/Relayers/utils'
import { RoundStatus } from '@/modules/Relayers/types'

import './index.scss'

type Props = {
    address?: string;
    title: string;
    titleLink?: string;
    startTime?: number;
    endTime?: number;
    size?: 'lg';
}

function mapStatus(status: RoundStatus): BadgeStatus | undefined {
    if (status === 'active') {
        return 'warning'
    }
    return 'disabled'
}

function mapStatusName(status: RoundStatus): string {
    if (status === 'active') {
        return 'ROUND_INFO_ACTIVE'
    }
    if (status === 'waiting') {
        return 'ROUND_INFO_ENDED'
    }
    return 'ROUND_INFO_FINISHED'
}

export function RoundCard({
    address,
    title,
    titleLink,
    startTime,
    endTime,
    size,
}: Props): JSX.Element {
    const intl = useIntl()
    const roundStatus = startTime !== undefined && endTime !== undefined
        ? getRoundStatus(startTime, endTime)
        : undefined

    return (
        <div
            className={classNames('round-card', {
                [`round-card_size_${size}`]: size !== undefined,
            })}
        >
            {address && (
                <UserAvatar address={address} />
            )}

            <div>
                <h3 className="round-card__title">
                    {titleLink ? (
                        <Link to={titleLink}>
                            {title}
                        </Link>
                    ) : title}
                </h3>

                <div className="round-card__meta">
                    {roundStatus !== undefined && (
                        <Badge status={mapStatus(roundStatus)}>
                            {intl.formatMessage({
                                id: mapStatusName(roundStatus),
                            })}
                        </Badge>
                    )}

                    {!startTime && !endTime ? (
                        '\u200B'
                    ) : (
                        <>
                            {startTime && endTime ? (
                                intl.formatMessage({
                                    id: 'ROUND_INFO_DATE_PERIOD',
                                }, {
                                    start: dateFormat(startTime),
                                    end: dateFormat(endTime),
                                })
                            ) : (
                                startTime && dateFormat(startTime)
                            )}
                        </>
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
