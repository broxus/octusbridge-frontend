import * as React from 'react'

import { Day } from '@/components/common/Timeline/day'
import { Line } from '@/components/common/Timeline/line'
import { Interval } from '@/components/common/Timeline/interval'

import './index.scss'

type Props = {
    timelineStart: number;
    timelineEnd: number;
    children: React.ReactNode | React.ReactNodeArray;
}

export function Container({
    timelineStart,
    timelineEnd,
    children,
}: Props): JSX.Element {
    const startRounded = new Date(timelineStart).setHours(0, 0, 0, 0)
    const endRounded = new Date(timelineEnd).setHours(24, 0, 0, 0)
    const days = (endRounded - startRounded) / 1000 / 60 / 60 / 24
    const dates: number[] = []

    for (let i = 0; i < days; i++) {
        dates.push(new Date(startRounded).setHours(24 * i, 0, 0, 0))
    }

    const currentDay = new Date().setHours(0, 0, 0, 0)
    const currentDayIndex = dates.findIndex(date => date === currentDay)

    let currentPercent
    const currentTime = new Date().getTime()

    if (currentTime >= startRounded && currentTime < endRounded) {
        const duration = endRounded - startRounded
        const currentDuration = currentTime - startRounded
        currentPercent = (currentDuration * 100) / duration
    }

    return (
        <div className="card card--flat card--small timeline">
            <div className="timeline__inner">
                <Line>
                    {dates.map((timestamp, index) => (
                        <Interval
                            key={timestamp}
                            timelineStart={timelineStart}
                            timelineEnd={timelineEnd}
                            intervalStart={timestamp}
                            intervalEnd={dates[index + 1]}
                        >
                            <Day
                                timestamp={timestamp}
                                active={currentDayIndex === index}
                            />
                        </Interval>
                    ))}

                    {currentPercent !== undefined && (
                        <div
                            className="timeline-day__cursor"
                            style={{
                                left: `${currentPercent}%`,
                            }}
                        />
                    )}
                </Line>

                <hr />

                {children}
            </div>
        </div>
    )
}
