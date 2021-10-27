import * as React from 'react'

import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useStakingData(
    tokensCache: TokensCacheService = useTokensCache(),
    tonWallet: TonWalletService = useTonWallet(),
): StakingDataStore {
    const ref = React.useRef<StakingDataStore>()
    ref.current = ref.current || new StakingDataStore(tokensCache, tonWallet)
    const stakingData = ref.current

    React.useEffect(() => {
        if (stakingData.isConnected) {
            stakingData.fetchData()
            stakingData.startUpdater()
        }
        else {
            stakingData.dispose()
            stakingData.stopUpdater()
        }

        return () => {
            stakingData.stopUpdater()
        }
    }, [stakingData.isConnected])

    return stakingData
}
