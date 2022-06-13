import { FullContractState } from 'everscale-inpage-provider'

import {
    EventConfigDetails, EventVoteData, RelayConfig, StackingDetails,
    UserDetails,
} from '@/misc/types'

export type ConfirmationStatus = 'pending' | 'checking' | 'confirmed' | 'disabled'

export type Status = 'active' | 'disabled' | 'slashed' | 'terminated' | 'confirmation'

export type RoundStatus = 'finished' | 'active' | 'waiting'

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

export type RelayersSearchOrdering =
    | 'stakeascending'
    | 'stakedescending'
    | 'createdatascending'
    | 'createdatdescending'

export type RelayersSearchFilters = {
    createdAtGe?: number;
    createdAtLe?: number;
    stakeGe?: string;
    stakeLe?: string;
}

export type RoundInterval = 'bidding' | 'default';

export type RelayersSearchParams = RelayersSearchFilters & {
    limit: number;
    offset: number;
    ordering: RelayersSearchOrdering;
    roundNum?: number;
    transferContractAddress?: string;
    roundInterval?: RoundInterval;
}

export type RelayersSearchResponse = {
    relays: {
        relayAddress: string;
        createdAt: number;
        currentRound: boolean;
        slashed: boolean;
        stake: string;
        successfulRounds: number;
        totalRounds: number;
        relayTotalConfirmed: number;
        potentialTotalConfirmed: number;
    }[];
    totalCount: number;
}

export type RoundInfoParams = {
    roundNum?: number;
}

export type RoundInfoResponse = Partial<{
    address: string;
    startTime: number;
    endTime: number;
    averageRelayStake: string;
    averageRelayStakeChange: string;
    ethToTonUsdt: string;
    eventsConfirmed: number;
    relaysCount: number;
    relaysCountChange: string;
    roundNum: number;
    tonToEthUsdt: string;
    totalStake: string;
    totalStakeChange: string;
    evmStats: EvmStats[];
}>

export type RelayRoundInfoParams = {
    relayAddress: string;
    roundNum?: number;
}

export type EvmStats = {
    chainId: number;
    potentialConfirmed: number;
    relayConfirmed: number;
}

export type RelayRoundInfoResponse = {
    ethToTonUsdt: string;
    eventsConfirmed: number;
    totalRoundConfirms: number;
    eventsConfirmedShare: string;
    roundNum: number;
    stake: string;
    relayPlace?: number;
    tonToEthUsdt: string;
    evmStats: EvmStats[];
}

export type RoundsCalendarParams = {
    fromRoundNum: number;
    toRoundNum: number;
}

export type RoundCalendar = {
    roundNum: number;
    electionEndTime?: number;
    electionStartTime?: number;
    endTime?: number;
    startTime?: number;
}

export type RoundCalendarValid = {
    roundNum: number;
    electionEndTime?: number;
    electionStartTime?: number;
    endTime: number;
    startTime: number;
}

export type RoundsCalendarResponse = RoundCalendar[]

export type RelayInfoParams = {
    relayAddress: string;
}

export type RelayInfoResponse = {
    frozenStake: string;
    latestReward: string;
    successfulRounds: number;
    totalCountRounds: number;
    totalReward: string;
    untilFrozen: number;
    potentialTotalConfirmed: number;
    relayTotalConfirmed: number;
}

export type RelayersEventsOrdering =
    | 'amountascending'
    | 'amountdescending'
    | 'timestampascending'
    | 'timestampdescending'

export type RelayersEventsTransferKind =
    | 'tontoeth'
    | 'ethtoton'
    | 'creditethtoton'

export type RelayersEventsFilters = {
    amountGe?: string;
    amountLe?: string;
    chainId?: number;
    relayAddress?: string;
    timestampGe?: number;
    timestampLe?: number;
    tokenAddress?: string;
    transferKind?: RelayersEventsTransferKind;
    transferContractAddress?: string;
}

export type RelayersEventsParams = RelayersEventsFilters & {
    limit: number;
    offset: number;
    ordering: RelayersEventsOrdering;
    roundNum?: number;
}

export type GlobalRelayersEventsParams = Omit<RelayersEventsParams, 'relayAddress'>

export type RelayersEventsResponse = {
    relays: RelayersEvent[];
    totalCount: number;
}

export type RelayersEvent = {
    amount: string;
    chainId: number;
    contractAddress: string;
    timestamp: number;
    tokenAddress: string;
    transferKind: RelayersEventsTransferKind;
    from?: string;
    to?: string;
}

export type RelayRoundsInfoOrdering =
    | 'stakeascending'
    | 'stakedescending'
    | 'roundnumascending'
    | 'roundnumdescending'

export type RelayRoundsInfoRequest = {
    limit: number;
    offset: number;
    ordering?: RelayRoundsInfoOrdering;
    roundNum?: number;
    userAddress?: string;
}

export type RelayRoundsInfo = {
    endTime?: number;
    eventsConfirmed: number;
    fromTonUsdt: string;
    fromTonUsdtShare: string;
    roundAddress: string;
    roundNum: number;
    stake: string;
    startTime?: number;
    toTonUsdt: string;
    toTonUsdtShare: string;
}

export type RelayRoundsInfoResponse = {
    relays: RelayRoundsInfo[];
    totalCount: number;
}

export type RelaysRoundInfoOrdering =
    | 'stakeascending'
    | 'stakedescending'

export type RelaysRoundInfoRequest = {
    limit: number;
    offset: number;
    ordering: RelaysRoundInfoOrdering;
    roundNum: number;
}

export type RelaysRoundInfo = {
    eventsConfirmed: number;
    relayAddress: string;
    relayPlace: number;
    roundNum: number;
    stake: string;
    ethToTonUsdt: string;
    tonToEthUsdt: string;
    totalRoundConfirms: number;
}

export type RelaysRoundInfoResponse = {
    relays: RelaysRoundInfo[];
    totalCount: number;
}

export type AllRelayRoundsInfoOrdering =
    | 'roundnumascending'
    | 'roundnumdescending'

export type AllRelayRoundsInfoRequest = {
    limit: number;
    offset: number;
    ordering: AllRelayRoundsInfoOrdering;
    userAddress: string;
}

export type AllRelayRoundsInfo = {
    ethToTonUsdt: string;
    eventsConfirmed: number;
    eventsConfirmedShare: string;
    relayAddress: string;
    relayPlace: number;
    roundNum: number;
    roundAddress: string;
    stake: string;
    tonToEthUsdt: string;
    startTime: number;
    endTime: number;
    totalRoundConfirms: number;
}

export type AllRelayRoundsInfoResponse = {
    relays: AllRelayRoundsInfo[];
    totalCount: number;
}

export type RelayersStoreState = {
    isLoading?: boolean;
}

export type RelayersStoreData = {
    relayers?: RelayersSearchResponse;
}

export type RoundInfoStoreState = {
    isLoading?: boolean;
}

export type RoundInfoStoreData = {
    roundInfo?: RoundInfoResponse;
}

export type RoundInfoListStoreData = {
    currentRoundNum?: number;
}

export type RelayRoundInfoStoreState = {
    isLoading?: boolean;
}

export type RelayRoundInfoStoreData = {
    relayRoundInfo?: RelayRoundInfoResponse;
}

export type RoundsCalendarStoreData = {
    roundsCalendar?: RoundCalendar[];
}

export type RelayInfoStoreData = {
    relayInfo?: RelayInfoResponse;
    address?: string;
}

export type RelayInfoStoreState = {
    isLoading?: boolean;
}

export type RelayersDataStoreData = {
    relayConfig?: RelayConfig;
}

export type RelayersEventsStoreData = {
    relayersEvents?: RelayersEventsResponse;
}

export type RelayersEventsStoreState = {
    isLoading?: boolean;
}

export type ValidationRoundStoreData = {
    lastRoundNum?: number;
    roundCalendar?: RoundCalendar;
}

export type ValidationRoundStoreState = {
    isLoading?: boolean;
}

export type TransferEventStoreData = {
    event?: RelayersEvent;
}

export type TransferEventStoreState = {
    isLoading?: boolean;
}

export type BiddingRoundStoreState = {
    isLoading?: boolean;
}

export type BiddingRoundStoreData = {
    roundsCalendar?: (RoundCalendar | undefined)[];
    lastRound?: RoundInfoResponse;
}

export type UserDataStoreData = {
    userDetails?: UserDetails;
}

export type RelayRoundsInfoStoreData = {
    relayRoundsInfo?: RelayRoundsInfoResponse;
}

export type RelayRoundsInfoStoreState = {
    isLoading?: boolean;
}

export type RelaysRoundInfoStoreState = {
    isLoading?: boolean;
}

export type RelaysRoundInfoStoreData = {
    relaysRoundInfo?: RelaysRoundInfoResponse;
}

export type AllRelayRoundsInfoStoreState = {
    isLoading?: boolean;
}

export type AllRelayRoundsInfoStoreData = {
    allRelayRoundsInfo?: AllRelayRoundsInfoResponse;
}
