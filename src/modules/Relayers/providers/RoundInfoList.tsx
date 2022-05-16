import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { useRoundInfoListStore } from '@/modules/Relayers/hooks'
import { RoundInfoListStore } from '@/modules/Relayers/store'
import { RoundInfoContext } from '@/modules/Relayers/providers/RoundInfo'
import { RelayRoundInfoContext } from '@/modules/Relayers/providers/RelayRoundInfo'

export const RoundInfoListContext = React.createContext<RoundInfoListStore | undefined>(undefined)

export function useRoundInfoListContext(): RoundInfoListStore {
    const roundInfoListContext = React.useContext(RoundInfoListContext)

    if (!roundInfoListContext) {
        throw new Error('RoundInfoListContext must be defined')
    }

    return roundInfoListContext
}

type Props = {
    children: React.ReactNode;
    relayAddress?: string;
}

export function RoundInfoListProviderInner({
    children,
    relayAddress,
}: Props): JSX.Element {
    const roundInfoList = useRoundInfoListStore(relayAddress)

    return (
        <RoundInfoListContext.Provider value={roundInfoList}>
            <RoundInfoContext.Provider value={roundInfoList.roundInfo}>
                <RelayRoundInfoContext.Provider value={roundInfoList.relayRoundInfo}>
                    {children}
                </RelayRoundInfoContext.Provider>
            </RoundInfoContext.Provider>
        </RoundInfoListContext.Provider>
    )
}

export const RoundInfoListProvider = observer(RoundInfoListProviderInner)
