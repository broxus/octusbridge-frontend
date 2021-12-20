import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = {
    value: string;
}

export function VoteReason({
    value,
}: Props): JSX.Element {
    const [active, setActive] = React.useState(false)

    const toggle = () => setActive(!active)

    return (
        <div
            onClick={toggle}
            className={classNames('vote-reason', {
                'vote-reason_active': active,
            })}
        >
            {value}
        </div>
    )
}
