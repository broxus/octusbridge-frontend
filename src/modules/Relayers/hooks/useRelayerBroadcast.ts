import * as React from 'react'

import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { RelayerBroadcastStore } from '@/modules/Relayers/store/RelayerBroadcast'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'

export function useRelayerBroadcast(
    stakingData: StakingDataStore,
    tonWallet: EverWalletService = useEverWallet(),
): RelayerBroadcastStore {
    const ref = React.useRef<RelayerBroadcastStore>()
    ref.current = ref.current || new RelayerBroadcastStore(tonWallet, stakingData)
    return ref.current
}
