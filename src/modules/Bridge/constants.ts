import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    TransferSummaryData,
} from '@/modules/Bridge/types'


export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA: CrosschainBridgeStoreData = {
    amount: '',
    depositType: 'default',
    leftAddress: '',
    rightAddress: '',
    swapType: '0',
    tokensAmount: '',
    tonsAmount: '',
}

export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE: CrosschainBridgeStoreState = {
    approvalStrategy: 'infinity',
    isSwapEnabled: false,
    isPendingAllowance: false,
    isPendingApproval: false,
    isProcessing: false,
    step: CrosschainBridgeStep.SELECT_ROUTE,
}

export const DEFAULT_TRANSFER_SUMMARY_STORE_DATA: TransferSummaryData = {
    amount: '',
    leftAddress: '',
    rightAddress: '',
}
