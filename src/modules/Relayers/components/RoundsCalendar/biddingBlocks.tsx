import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Block } from '@/modules/Relayers/components/RoundsCalendar/block'
import { Scale } from '@/modules/Relayers/components/RoundsCalendar/scale'
import { useRoundsCalendarContext } from '@/modules/Relayers/providers'
import { DAY_MS } from '@/modules/Relayers/constants'
import { getRoundStatus } from '@/modules/Relayers/utils'
import { RoundStatus } from '@/modules/Relayers/types'

import './index.scss'

function mapLabel(status: RoundStatus): string {
    if (status === 'active') {
        return 'RELAYERS_CALENDAR_ROUND_ACTIVE'
    }

    if (status === 'finished') {
        return 'RELAYERS_CALENDAR_ROUND_FINISHED'
    }

    return 'RELAYERS_CALENDAR_ROUND_NOT_STARTED'
}

export function BiddingBlocksInner(): JSX.Element | null {
    const intl = useIntl()
    const roundsCalendar = useRoundsCalendarContext()
    const { rounds } = roundsCalendar

    if (!rounds || !rounds.length) {
        return null
    }

    const startDate = new Date(rounds[0].startTime)
    const endDate = new Date(rounds[0].endTime)

    const startTime = (startDate.getHours() > 12
        ? startDate.setHours(24, 0, 0, 0)
        : startDate.setHours(0, 0, 0, 0))
        - (DAY_MS * 2)

    const endTime = (endDate.getHours() > 12
        ? endDate.setHours(24, 0, 0, 0)
        : endDate.setHours(0, 0, 0, 0))
        + (DAY_MS * 2)

    const prevRound = rounds[0].roundNum > 0 ? {
        startTime,
        endTime: rounds[0].startTime,
        content: (
            <Block>
                {intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_ROUND_FINISHED',
                })}
            </Block>
        ),
    } : undefined

    const waitForBidding = rounds[1].electionStartTime ? {
        startTime: rounds[0].startTime,
        endTime: rounds[1].electionStartTime,
        content: (
            <Block status="success">
                {intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_WAIT_BIDDING',
                })}
            </Block>
        ),
    } : undefined

    const bidding = rounds[1].electionStartTime && rounds[1].electionEndTime ? {
        startTime: rounds[1].electionStartTime,
        endTime: rounds[1].electionEndTime,
        content: (
            <Block status="active">
                {intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_BIDDING',
                })}
            </Block>
        ),
    } : undefined

    const waitForStarting = rounds[1].electionEndTime ? {
        startTime: rounds[1].electionEndTime,
        endTime: rounds[1].startTime,
        content: (
            <Block status="waiting">
                {intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_WAIT_STARTING',
                })}
            </Block>
        ),
    } : undefined

    const nextRound = {
        startTime: rounds[0].endTime,
        endTime,
        content: (
            <Block>
                {intl.formatMessage({
                    id: mapLabel(getRoundStatus(rounds[1].startTime, rounds[1].endTime)),
                })}
            </Block>
        ),
    }

    const finished = {
        startTime: rounds[0].startTime,
        endTime: rounds[0].endTime,
        content: (
            <Block>
                {intl.formatMessage({
                    id: mapLabel(getRoundStatus(rounds[0].startTime, rounds[0].endTime)),
                })}
            </Block>
        ),
    }

    const items = []
    if (prevRound) {
        items.push(prevRound)
    }
    if (getRoundStatus(rounds[0].startTime, rounds[0].endTime) === 'finished') {
        items.push(finished)
    }
    else {
        if (waitForBidding) {
            items.push(waitForBidding)
        }
        if (bidding) {
            items.push(bidding)
        }
        if (waitForStarting) {
            items.push(waitForStarting)
        }
    }
    if (nextRound) {
        items.push(nextRound)
    }

    return (
        <>
            <Scale
                items={items}
            />
        </>
    )
}

export const BiddingBlocks = observer(BiddingBlocksInner)
