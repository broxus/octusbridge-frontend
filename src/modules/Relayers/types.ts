import { FullContractState } from 'ton-inpage-provider'

import {
    EventVoteData, RelayConfig, StackingDetails, UserDetails,
} from '@/misc/types'

export type ConfirmationStatus = 'pending' | 'confirmed' | 'disabled'

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
}

export type RelayerBroadcastStoreState = {
    isLoading: boolean;
    isSubmitted: boolean;
}

export type RelayerBroadcastStoreData = {
}

export type RelayerLinkStoreState = {
    isLoading: boolean;
    isSubmitted: boolean;
    isLinked: boolean;
}

export type RelayerLinkStoreData = {
    tonPublicKey: string;
    ethAddress: string;
}
