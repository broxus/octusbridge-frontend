import * as React from 'react'

import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { RelayerLinkStore } from '@/modules/Relayers/store/RelayerLink'
import { EverWalletService, useEverWallet } from '@/stores/EverWalletService'

export function useRelayerLink(
    stakingData: StakingDataStore,
    tonWallet: EverWalletService = useEverWallet(),
): RelayerLinkStore {
    const ref = React.useRef<RelayerLinkStore>()
    ref.current = ref.current || new RelayerLinkStore(tonWallet, stakingData)
    return ref.current
}
