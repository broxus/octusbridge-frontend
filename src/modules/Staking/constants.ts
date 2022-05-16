import {
    RedeemFormStoreData, RedeemFormStoreState, StakingFormStoreData,
    StakingFormStoreState,
} from '@/modules/Staking/types'

export const STAKING_PAYLOAD = 'te6ccgEBAQEAAwAAAgA='

export const REDEEM_FORM_STORE_DEFAULT_STATE: RedeemFormStoreState = {
    isLoading: false,
}

export const REDEEM_FORM_STORE_DEFAULT_DATA: RedeemFormStoreData = {
    amount: '',
}

export const STAKING_FORM_STORE_DEFAULT_STATE: StakingFormStoreState = {
    isLoading: false,
}

export const STAKING_FORM_STORE_DEFAULT_DATA: StakingFormStoreData = {
    amount: '',
}
