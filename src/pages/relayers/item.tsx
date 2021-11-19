import * as React from 'react'

import { Relayer } from '@/modules/Relayers/Relayer'
import { RelayerStoreProvider } from '@/modules/Relayers/providers/RelayerStoreProvider'

export default function Page(): JSX.Element {
    return (
        <RelayerStoreProvider>
            <Relayer />
        </RelayerStoreProvider>
    )
}
