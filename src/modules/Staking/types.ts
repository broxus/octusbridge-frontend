import { Contract, DecodedAbiFunctionOutputs } from 'ton-inpage-provider'

import { StackingAbi, UserDataAbi } from '@/misc'

export enum ActionType {
    Stake,
    Redeem,
}

export type StackingContract = Contract<typeof StackingAbi.Root>

export type StackingDetails = DecodedAbiFunctionOutputs<typeof StackingAbi.Root, 'getDetails'>['value0']

export type UserDetails = DecodedAbiFunctionOutputs<typeof UserDataAbi.Root, 'getDetails'>['value0']

export type AccountDataStoreState = {
    isLoading: boolean;
}

export type AccountDataStoreData = {
    stackingDetails?: StackingDetails;
    userDetails?: UserDetails;
}

export type RedeemFormStoreState = {
    isLoading: boolean;
}

export type RedeemFormStoreData = {
    amount: string;
}

export type StakingFormStoreState = {
    isLoading: boolean;
}

export type StakingFormStoreData = {
    amount: string;
}
