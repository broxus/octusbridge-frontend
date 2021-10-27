import {
    RelayerBroadcastStoreData, RelayerBroadcastStoreState, RelayerLinkStoreData,
    RelayerLinkStoreState, StakingDataStoreData, StakingDataStoreState,
} from '@/modules/Relayers/types'

export const INDICATOR_LABEL_INTL_ID_BY_STATUS = {
    disabled: 'RELAYERS_CREATE_INDICATOR_DISABLED',
    pending: 'RELAYERS_CREATE_INDICATOR_PENDING',
    confirmed: 'RELAYERS_CREATE_INDICATOR_CONFIRMED',
}

export const STAKING_DATA_STORE_DEFAULT_STATE: StakingDataStoreState = {
    isLoading: false,
    isLoaded: false,
}

export const STAKING_DATA_STORE_DEFAULT_DATA: StakingDataStoreData = {
}

export const RELAYER_BROADCAST_STORE_STATE: RelayerBroadcastStoreState = {
    isLoading: false,
    isSubmitted: false,
}

export const RELAYER_BROADCAST_STORE_DATA: RelayerBroadcastStoreData = {
}

export const RELAYER_LINK_STORE_STATE: RelayerLinkStoreState = {
    isLoading: false,
    isSubmitted: false,
    isLinked: false,
}

export const RELAYER_LINK_STORE_DATA: RelayerLinkStoreData = {
    tonPublicKey: '',
    ethAddress: '',
}

export const TON_PUBLIC_KEY_REGEXP = /^(0x)?[a-fA-F0-9]{64}$/
export const ETH_ADDRESS_REGEXP = /^(0x)?[0-9a-fA-F]{40}$/
