import * as React from 'react'

import './index.scss'

type Props = {
    timelineStart: number;
    timelineEnd: number;
    intervalStart?: number;
    intervalEnd?: number;
    children: React.ReactNode;
}

export function Interval({
    timelineStart,
    timelineEnd,
    intervalStart,
    intervalEnd,
    children,
}: Props): JSX.Element {
    const timelineStartRounded = new Date(timelineStart).setHours(0, 0, 0, 0)
    const timelineEndRounded = new Date(timelineEnd).setHours(24, 0, 0, 0)
    const timelineDuration = timelineEndRounded - timelineStartRounded
    const start = intervalStart || timelineStartRounded
    const end = intervalEnd || timelineEndRounded
    const duration = end - start
    const width = (100 / timelineDuration) * duration

    return (
        <div style={{ width: `${width}%` }}>
            {children}
        </div>
    )
}
