import * as React from 'react'

import { Relayer } from '@/modules/Relayers/Relayer'
import { RelayInfoProvider, UserDataProvider } from '@/modules/Relayers/providers'

export default function Page(): JSX.Element {
    return (
        <UserDataProvider>
            <RelayInfoProvider>
                <Relayer />
            </RelayInfoProvider>
        </UserDataProvider>
    )
}
