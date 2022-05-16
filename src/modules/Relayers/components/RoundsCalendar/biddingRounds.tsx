import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Round } from '@/modules/Relayers/components/RoundsCalendar/round'
import { Scale } from '@/modules/Relayers/components/RoundsCalendar/scale'
import { useRoundsCalendarContext } from '@/modules/Relayers/providers'
import { getRoundStatus } from '@/modules/Relayers/utils'
import { DAY_MS } from '@/modules/Relayers/constants'

import './index.scss'

export function BiddingRoundsInner(): JSX.Element | null {
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
            <Round
                link={`/relayers/bidding/${rounds[0].roundNum}`}
                title={intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_BIDDING_ROUND',
                }, {
                    roundNum: rounds[0].roundNum,
                })}
            />
        ),
    } : undefined

    const currentRound = {
        startTime: rounds[0].startTime,
        endTime: rounds[0].endTime,
        content: (
            <Round
                link={`/relayers/bidding/${rounds[0].roundNum + 1}`}
                title={intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_BIDDING_ROUND',
                }, {
                    roundNum: rounds[0].roundNum + 1,
                })}
            />
        ),
    }

    const nextRound = {
        startTime: rounds[0].endTime,
        endTime,
        content: (
            <Round
                link={getRoundStatus(rounds[1].startTime, rounds[1].endTime) !== 'waiting'
                    ? `/relayers/bidding/${rounds[0].roundNum + 2}`
                    : undefined}
                title={intl.formatMessage({
                    id: 'RELAYERS_CALENDAR_BIDDING_ROUND',
                }, {
                    roundNum: rounds[0].roundNum + 2,
                })}
            />
        ),
    }

    const items = [currentRound, nextRound]
    if (prevRound) {
        items.unshift(prevRound)
    }

    return (
        <>
            <Scale
                items={items}
                className="rounds-calendar__names"
            />

            <div className="rounds-calendar-scale rounds-calendar__names-short">
                <div className="rounds-calendar-scale__section">
                    <div className="rounds-calendar-round__title">
                        {intl.formatMessage({
                            id: 'RELAYERS_CALENDAR_BIDDING_ROUNDS',
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export const BiddingRounds = observer(BiddingRoundsInner)
