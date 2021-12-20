import * as React from 'react'
import classNames from 'classnames'

import { getVotesPercents } from '@/modules/Governance/utils'
import './index.scss'

type Props = {
    againstVotes?: string;
    forVotes?: string;
}

export function ProposalProgress({
    againstVotes = '0',
    forVotes = '0',
}: Props): JSX.Element {
    const [left, right] = getVotesPercents(forVotes, againstVotes)

    return (
        <div className="proposal-progress">
            <div className="proposal-progress__head">
                <div
                    className={classNames('proposal-progress__value', {
                        'proposal-progress__value_left': left > 0,
                    })}
                >
                    {left}
                    %
                </div>
                <div
                    className={classNames('proposal-progress__value', {
                        'proposal-progress__value_right': right > 0,
                    })}
                >
                    {right}
                    %
                </div>
            </div>
            <div className="proposal-progress__bar">
                <div
                    className="proposal-progress__progress proposal-progress__progress_left"
                    style={{
                        width: `${left}%`,
                    }}
                />
                <div
                    className="proposal-progress__progress proposal-progress__progress_right"
                    style={{
                        width: `${right}%`,
                    }}
                />
            </div>
        </div>
    )
}
