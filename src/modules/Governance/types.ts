import { Address } from 'everscale-inpage-provider'

import {
    CastedVotes, ProposalConfig, StackingDetails,
} from '@/misc'

export enum ActionNetwork {
    TON, ETH,
}

export type Description = {
    title?: string;
    description?: string;
    link?: string;
}

export type ProposalVote = {
    createdAt?: number;
    messageHash?: string;
    proposalId?: number;
    reason?: string;
    support?: boolean;
    timestampBlock?: number;
    transactionHash?: string;
    voter?: string;
    votes?: string;
    locked?: boolean;
}

export type EthAction = {
    callData: string;
    chainId: number;
    signature: string;
    target: string;
    value: string;
}

export type TonAction = {
    payload: string;
    target: string;
    value: string;
}

export type ProposalsColumn = 'createdAt' | 'updatedAt'

export type ProposalsDirection = 'DESC' | 'ASC'

export type ProposalsOrdering = {
    column: ProposalsColumn;
    direction: ProposalsDirection;
}

export type ProposalState = 'Pending' | 'Active' | 'Canceled' | 'Failed' | 'Succeeded' | 'Expired' | 'Queued' | 'Executed'

export type Proposal = {
    actions?: {
      ethActions?: EthAction[];
      tonActions?: TonAction[];
    };
    againstVotes?: string;
    canceled?: boolean;
    canceledAt?: number;
    proposalAddress?: string;
    createdAt?: number;
    description?: string;
    endTime?: number;
    executed?: boolean;
    executedAt?: number;
    executionTime?: number;
    forVotes?: string;
    gracePeriod?: number;
    messageHash?: string;
    proposalId: number;
    proposer?: string;
    queued?: boolean;
    queuedAt?: number;
    quorumVotes?: string;
    startTime?: number;
    state?: ProposalState;
    timestampBlock?: number;
    transactionHash?: string;
    updatedAt?: number;
    timeLock?: number;
    votingDelay?: number;
}

export type ProposalWithVote = {
    proposal: Proposal;
    vote: ProposalVote;
}

export type ProposalsParams = {
    limit: number;
    offset: number;
    ordering?: ProposalsOrdering;
    proposer?: string;
    proposalId?: number;
}

export type ProposalsFilters = {
    endTimeGe?: number;
    endTimeLe?: number;
    startTimeGe?: number;
    startTimeLe?: number;
    state?: ProposalState;
    locked?: boolean;
    availableForUnlock?: true;
}

export type ProposalsRequest = ProposalsParams & ProposalsFilters

export type ProposalsResponse = {
    proposals: Proposal[];
    totalCount: number;
}

export type UserProposalsResponse = {
    proposalWithVotes: ProposalWithVote[];
    totalCount: number;
}

export type Vote = {
    createdAt: number;
    messageHash: string;
    proposalId: number;
    reason?: string;
    support: boolean;
    timestampBlock: number;
    transactionHash: string;
    voter: string;
    votes: string;
}

export type VotesColumn = 'createdAt' | 'updatedAt'

export type VotesDirection = 'DESC' | 'ASC'

export type VotesOrdering = {
    column: VotesColumn;
    direction: VotesDirection;
}

export type VotesFilters = {
    support?: boolean;
}

export type VotesParams = {
    limit: number;
    offset: number;
    ordering: VotesOrdering;
    proposalId?: number;
    voter?: string;
}

export type VotesRequest = VotesParams & VotesFilters

export type VotesResponse = {
    totalCount: number;
    votes: Vote[];
}

export type Stakeholder = {
    proposalVotesCount: number;
    userAddress: string;
    voteWeight: string;
    votes: string;
}

export type StakeholdersOrdering =
    | 'voteweightascending'
    | 'voteweightdescending'
    | 'votesascending'
    | 'votesdescending'

export type StakeholdersRequest = {
    limit: number;
    offset: number;
    ordering: StakeholdersOrdering;
}

export type StakeholdersResponse = {
    stakeholders: Stakeholder[];
    totalCount: number;
}

export type ProposalsCountResponse = {
    count: number;
    voter: string;
}[]

export type ProposalsStoreData = {
    response?: ProposalsResponse;
}

export type ProposalsStoreState = {
    loading?: boolean;
}

export type UserProposalsStoreData = {
    response?: UserProposalsResponse;
}

export type UserProposalsStoreState = {
    loading?: boolean;
}

export type ProposalStoreData = {
    response?: ProposalsResponse;
}

export type ProposalStoreState = {
    cancelLoading?: boolean;
    queueLoading?: boolean;
    executeLoading?: boolean;
    proposalLoading?: boolean;
}

export type VotesStoreData = {
    response?: VotesResponse;
}

export type VotesStoreState = {
    loading?: boolean;
    params?: VotesParams;
}

export type ConfigStoreData = {
    config?: ProposalConfig;
}

export type ConfigStoreState = {
    loading: boolean;
}

export type VotingStoreState = {
    castLoading?: boolean;
    unlockLoading?: boolean;
    unlockedIds?: number[];
}

export type ProposalCreateStoreState = {
    createLoading?: boolean;
}

export type UserDataStoreData = {
    userDataAddress?: Address;
    tokenBalance?: string;
    lockedTokens?: string;
    castedVotes?: CastedVotes;
    stakingDetails?: StackingDetails;
    stakeholder?: Stakeholder;
    votesCount?: number;
}

export type UserDataStoreState = {
    hasAccount?: boolean;
}

export type StakeholdersStoreData = {
    response?: StakeholdersResponse;
}

export type StakeholdersStoreState = {
    loading?: boolean;
}
