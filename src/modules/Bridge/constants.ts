import BigNumber from 'bignumber.js'

import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    NetworkShape,
} from '@/modules/Bridge/types'


export const networks: NetworkShape[] = [
    {
        chainId: '3',
        label: 'Ropsten',
        type: 'evm',
    },
    {
        chainId: '5',
        label: 'Goerli',
        type: 'evm',
    },
    {
        chainId: '1',
        label: 'Free TON',
        type: 'ton',
    },
]

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

