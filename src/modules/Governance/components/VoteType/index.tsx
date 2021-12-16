import * as React from 'react'
import { useIntl } from 'react-intl'

import { Badge } from '@/components/common/Badge'

import './index.scss'

type Props = {
    type: 1 | 0;
    value?: string;
    badge?: boolean;
}

export function VoteType({
    type,
    value,
    badge,
}: Props): JSX.Element {
    const intl = useIntl()

    const typeStr = type === 1
        ? intl.formatMessage({
            id: 'PROPOSALS_VOTE_1',
        }) : intl.formatMessage({
            id: 'PROPOSALS_VOTE_0',
        })


    return (
        <div className="vote-type">
            {badge ? (
                <Badge
                    status={type === 1 ? 'success' : 'fail'}
                    className="vote-type__badge"
                >
                    {typeStr}
                </Badge>
            ) : (
                <div className="vote-type__type">
                    {typeStr}
                </div>
            )}
            {value && (
                <div className="vote-type__value">
                    {value}
                </div>
            )}
        </div>
    )
}
