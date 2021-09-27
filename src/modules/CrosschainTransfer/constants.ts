import BigNumber from 'bignumber.js'

import {
    CrosschainTransferStep,
    CrosschainTransferStoreData,
    CrosschainTransferStoreState,
    NetworkShape,
} from '@/modules/CrosschainTransfer/types'

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

export const DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA: CrosschainTransferStoreData = {
    amount: '',
    approvalDelta: new BigNumber(0),
    approvalStrategy: 'infinity',
    leftAddress: '',
    rightAddress: '',
}

export const DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE: CrosschainTransferStoreState = {
    isAwaitConfirmation: false,
    step: CrosschainTransferStep.SELECT_ROUTE,
}

