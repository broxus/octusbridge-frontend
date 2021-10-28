import * as React from 'react'

import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { RelayerBroadcastStore } from '@/modules/Relayers/store/RelayerBroadcast'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useRelayerBroadcast(
    stakingData: StakingDataStore,
    tonWallet: TonWalletService = useTonWallet(),
): RelayerBroadcastStore {
    const ref = React.useRef<RelayerBroadcastStore>()
    ref.current = ref.current || new RelayerBroadcastStore(tonWallet, stakingData)
    return ref.current
}
