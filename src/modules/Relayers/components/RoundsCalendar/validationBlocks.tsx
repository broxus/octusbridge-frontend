import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Scale } from '@/modules/Relayers/components/RoundsCalendar/scale'
import { Block } from '@/modules/Relayers/components/RoundsCalendar/block'
import { useRoundsCalendarContext } from '@/modules/Relayers/providers'
import { DAY_MS } from '@/modules/Relayers/constants'
import { RoundStatus } from '@/modules/Relayers/types'
import { getRoundStatus } from '@/modules/Relayers/utils'

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

type Props = {
    className?: string;
}

export function ValidationBlocksInner({
    className,
}: Props): JSX.Element | null {
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

    const prevRound = rounds[0].roundNum - 1 >= 0 ? {
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

    const currentRound = {
        startTime: rounds[0].startTime,
        endTime: rounds[0].endTime,
        content: (
            <Block
                status={getRoundStatus(rounds[0].startTime, rounds[0].endTime) === 'active' ? 'active' : undefined}
            >
                {intl.formatMessage({
                    id: mapLabel(getRoundStatus(rounds[0].startTime, rounds[0].endTime)),
                })}
            </Block>
        ),
    }

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

    const items = [currentRound, nextRound]
    if (prevRound) {
        items.unshift(prevRound)
    }

    return (
        <Scale
            className={className}
            items={items}
        />
    )
}

export const ValidationBlocks = observer(ValidationBlocksInner)
