import * as React from 'react'
import { useIntl } from 'react-intl'

import {
    Block, Container, Interval, Line,
} from '@/components/common/Timeline'

import './index.scss'

type Props = {
    createdAt: number;
    startTime: number;
    queuedAt: number;
    executedAt: number;
    gracePeriod: number;
}

export function Timeline({
    createdAt,
    startTime,
    queuedAt,
    executedAt,
    gracePeriod,
}: Props): JSX.Element | null {
    const intl = useIntl()
    const timelineStart = createdAt
    const timelineEnd = executedAt + gracePeriod

    return (
        <Container
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
        >
            <Line>
                <Interval
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    intervalEnd={createdAt}
                >
                    <Block disabled />
                </Interval>

                <Interval
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    intervalStart={createdAt}
                    intervalEnd={startTime}
                >
                    <Block>
                        {intl.formatMessage({
                            id: 'PROPOSAL_TIMELINE_PENDING',
                        })}
                    </Block>
                </Interval>

                <Interval
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    intervalStart={startTime}
                    intervalEnd={queuedAt}
                >
                    <Block status="active">
                        {intl.formatMessage({
                            id: 'PROPOSAL_TIMELINE_VOTING',
                        })}
                    </Block>
                </Interval>

                <Interval
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    intervalStart={queuedAt}
                    intervalEnd={executedAt}
                >
                    <Block status="waiting">
                        {intl.formatMessage({
                            id: 'PROPOSAL_TIMELINE_QUEUED',
                        })}
                    </Block>
                </Interval>

                <Interval
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    intervalStart={executedAt}
                    intervalEnd={timelineEnd}
                >
                    <Block status="success">
                        {intl.formatMessage({
                            id: 'PROPOSAL_TIMELINE_EXECUTION',
                        })}
                    </Block>
                </Interval>

                <Interval
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    intervalStart={timelineEnd}
                >
                    <Block disabled />
                </Interval>
            </Line>
        </Container>
    )
}
