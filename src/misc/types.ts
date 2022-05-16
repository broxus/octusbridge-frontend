import { Contract, DecodedAbiFunctionInputs, DecodedAbiFunctionOutputs } from 'everscale-inpage-provider'

import {
    DaoAbi, ProposalAbi, StackingAbi, TokenAbi, UserDataAbi,
} from '@/misc/abi'

export type StackingDetails = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'getDetails'>['value0']

export type PendingReward = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'pendingReward'>['value0']

export type UserDetails = DecodedAbiFunctionOutputs<typeof UserDataAbi.Root, 'getDetails'>['value0']

export type RelayConfig = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'getRelayConfig'>['value0']

export type RelayRoundsDetails = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'getRelayRoundsDetails'>['value0']

export type EventVoteData = DecodedAbiFunctionInputs<typeof TokenAbi.EthEventConfig, 'deployEvent'>['eventVoteData']

export type EventConfigDetails = DecodedAbiFunctionOutputs<typeof TokenAbi.EthEventConfig, 'getDetails'>

export type StackingContract = Contract<typeof StackingAbi.Root>

export type ProposalConfig = DecodedAbiFunctionOutputs<typeof ProposalAbi.Root, 'getConfig'>['value0']

export type CastedVotes = DecodedAbiFunctionOutputs<typeof UserDataAbi.Root, 'casted_votes'>['casted_votes']

export type CreateProposalData = DecodedAbiFunctionInputs<typeof DaoAbi.Root, 'propose'>
