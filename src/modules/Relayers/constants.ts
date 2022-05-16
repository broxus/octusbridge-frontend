import {
    RelayerBroadcastStoreData, RelayerBroadcastStoreState, RelayerLinkStoreData,
    RelayerLinkStoreState, StakingDataStoreData, StakingDataStoreState,
} from '@/modules/Relayers/types'

export const DAY_MS = 1000 * 60 * 60 * 24

export const INDICATOR_LABEL_INTL_ID_BY_STATUS = {
    disabled: 'RELAYERS_CREATE_INDICATOR_DISABLED',
    pending: 'RELAYERS_CREATE_INDICATOR_PENDING',
    checking: 'RELAYERS_CREATE_INDICATOR_CHECKING',
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
    isConfirming: false,
    isLinked: false,
    isSubmitted: false,
}

export const RELAYER_LINK_STORE_DATA: RelayerLinkStoreData = {
    tonPublicKey: '',
    ethAddress: '',
}

export const TON_PUBLIC_KEY_REGEXP = /^(0x)?[a-fA-F0-9]{64}$/
export const ETH_ADDRESS_REGEXP = /^(0x)?[0-9a-fA-F]{40}$/

export const RELAYER_EXPLORER_LOCATION = '/relayers'

export const RELAYER_STATUS_NAME_INTL_ID_BY_STATUS = {
    active: 'RELAYER_STATUS_ACTIVE',
    disabled: 'RELAYER_STATUS_DISABLED',
    slashed: 'RELAYER_STATUS_SLASHED',
    terminated: 'RELAYER_STATUS_TERMINATED',
    confirmation: 'RELAYER_STATUS_CONFIRMATION',
}
