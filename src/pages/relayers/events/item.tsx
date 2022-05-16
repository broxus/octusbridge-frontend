import * as React from 'react'

import { Event } from '@/modules/Relayers/Event'
import { TransferEventProvider } from '@/modules/Relayers/providers'

export default function Page(): JSX.Element {
    return (
        <TransferEventProvider>
            <Event />
        </TransferEventProvider>
    )
}
