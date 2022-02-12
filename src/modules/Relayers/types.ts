import { FullContractState } from 'everscale-inpage-provider'

import {
    EventConfigDetails, EventVoteData, RelayConfig, StackingDetails, UserDetails,
} from '@/misc/types'

export type ConfirmationStatus = 'pending' | 'checking' | 'confirmed' | 'disabled'

export type Status = 'active' | 'disabled' | 'slashed' | 'terminated' | 'confirmation'

export type StakingDataStoreState = {
    isLoading: boolean;
    isLoaded: boolean;
}

export type StakingDataStoreData = {
    stackingDetails?: StackingDetails;
    userDetails?: UserDetails;
    relayConfig?: RelayConfig;
    eventVoteData?: EventVoteData;
    eventState?: FullContractState;
    eventConfigDetails?: EventConfigDetails;
}

export type RelayerBroadcastStoreState = {
    isLoading: boolean;
    isSubmitted: boolean;
}

export type RelayerBroadcastStoreData = {
}

export type RelayerLinkStoreState = {
    isLoading: boolean;
    isConfirming: boolean;
    isLinked: boolean;
    isSubmitted: boolean;
}

export type RelayerLinkStoreData = {
    tonPublicKey: string;
    ethAddress: string;
}

export type RelayerRouteParams = {
    address: string;
}
