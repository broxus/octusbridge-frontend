import * as React from 'react'

import { useRoundsCalendarStore } from '@/modules/Relayers/hooks'
import { RoundsCalendarStore } from '@/modules/Relayers/store'

export const RoundsCalendarContext = React.createContext<RoundsCalendarStore | undefined>(undefined)

export function useRoundsCalendarContext(): RoundsCalendarStore {
    const roundsCalendarContext = React.useContext(RoundsCalendarContext)

    if (!roundsCalendarContext) {
        throw new Error('RoundsCalendarContext must be defined')
    }

    return roundsCalendarContext
}

type Props = {
    children: React.ReactNode;
}

export function RoundsCalendarProvider({
    children,
}: Props): JSX.Element {
    const roundsCalendar = useRoundsCalendarStore()

    return (
        <RoundsCalendarContext.Provider value={roundsCalendar}>
            {children}
        </RoundsCalendarContext.Provider>
    )
}
