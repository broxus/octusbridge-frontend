import * as React from 'react'
import { useParams } from 'react-router-dom'

import { RelayerStore } from '@/modules/Relayers/store/Relayer'
import { useRelayerStore } from '@/modules/Relayers/hooks/useRelayer'
import { RelayerRouteParams } from '@/modules/Relayers/types'
import { error } from '@/utils'

type Props = {
    children: React.ReactNode;
}

export const RelayerStoreContext = React.createContext<RelayerStore | undefined>(undefined)

export function RelayerStoreProvider({
    children,
}: Props): JSX.Element | null {
    const routeParams = useParams<RelayerRouteParams>()
    const relayerStore = useRelayerStore()

    const fetchData = async () => {
        try {
            await relayerStore.fetch(routeParams.address)
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [routeParams.address])

    return (
        <RelayerStoreContext.Provider value={relayerStore}>
            {children}
        </RelayerStoreContext.Provider>
    )
}
