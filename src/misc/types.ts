import { Contract, DecodedAbiFunctionInputs, DecodedAbiFunctionOutputs } from 'ton-inpage-provider'

import { StackingAbi, TokenAbi, UserDataAbi } from '@/misc/abi'

export type StackingDetails = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'getDetails'>['value0']

export type UserDetails = DecodedAbiFunctionOutputs<typeof UserDataAbi.Root, 'getDetails'>['value0']

export type RelayConfig = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'getRelayConfig'>['value0']

export type EventVoteData = DecodedAbiFunctionInputs<typeof TokenAbi.EthEventConfig, 'deployEvent'>['eventVoteData']

export type EventConfigDetails = DecodedAbiFunctionOutputs<typeof TokenAbi.EthEventConfig, 'getDetails'>

export type StackingContract = Contract<typeof StackingAbi.Root>
