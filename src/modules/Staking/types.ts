import { StackingDetails, UserDetails } from '@/misc/types'

export enum ActionType {
    Stake,
    Redeem,
}

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
