import BigNumber from 'bignumber.js'


import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
} from '@/modules/Bridge/types'


export const DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA: CrosschainBridgeStoreData = {
    amount: '',
    approvalDelta: new BigNumber(0),
    leftAddress: '',
    rightAddress: '',
}

export const DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE: CrosschainBridgeStoreState = {
    approvalStrategy: 'infinity',
    step: CrosschainBridgeStep.SELECT_ROUTE,
}

