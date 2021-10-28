import * as React from 'react'

import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { RelayerLinkStore } from '@/modules/Relayers/store/RelayerLink'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'

export function useRelayerLink(
    stakingData: StakingDataStore,
    tonWallet: TonWalletService = useTonWallet(),
): RelayerLinkStore {
    const ref = React.useRef<RelayerLinkStore>()
    ref.current = ref.current || new RelayerLinkStore(tonWallet, stakingData)
    return ref.current
}
