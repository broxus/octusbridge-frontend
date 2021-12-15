import * as React from 'react'
import { useIntl } from 'react-intl'

import './index.scss'

type Props = {
    type: 1 | 0;
    value: string;
}

export function VoteType({
    type,
    value,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="vote-type">
            <div className="vote-type__type">
                {type === 1
                    ? intl.formatMessage({
                        id: 'PROPOSALS_VOTE_1',
                    })
                    : intl.formatMessage({
                        id: 'PROPOSALS_VOTE_0',
                    })}
            </div>
            <div className="vote-type__value">
                {value}
            </div>
        </div>
    )
}
