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
            stakingData.startSync()
        }
        else {
            stakingData.dispose()
            stakingData.stopSync()
        }

        return () => {
            stakingData.stopSync()
        }
    }, [stakingData.isConnected])

    return stakingData
}
