import * as React from 'react'

import { RoundsCalendarStore } from '@/modules/Relayers/store'

export function useRoundsCalendarStore(): RoundsCalendarStore {
    const ref = React.useRef<RoundsCalendarStore>()
    ref.current = ref.current || new RoundsCalendarStore()
    return ref.current
}
