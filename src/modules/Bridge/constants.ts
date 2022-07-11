import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    EverscaleTransferStoreData,
    EverscaleTransferStoreState,
    EvmHiddenSwapTransferStoreData,
    EvmHiddenSwapTransferStoreState,
    EvmSwapTransferStoreData,
    EvmSwapTransferStoreState,
    EvmTransferStoreData,
    EvmTransferStoreState,
    TransferSummaryData,
    TransferSummaryState,
} from '@/modules/Bridge/types'


export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA: CrosschainBridgeStoreData = {
    amount: '',
    bridgeFee: undefined,
    creditFactoryFee: undefined,
    depositType: 'default',
    eversAmount: undefined,
    leftAddress: '',
    leftNetwork: undefined,
    minAmount: undefined,
    maxTokenAmount: undefined,
    maxEversAmount: undefined,
    maxTransferFee: undefined,
    minReceiveTokens: undefined,
    minEversAmount: undefined,
    minTransferFee: undefined,
    pairAddress: undefined,
    pairState: undefined,
    rightAddress: '',
    rightNetwork: undefined,
    selectedToken: undefined,
    swapType: '0',
    tokenAmount: undefined,
    txHash: undefined,
}

export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE: CrosschainBridgeStoreState = {
    approvalStrategy: 'infinity',
    isCalculating: false,
    isFetching: false,
    isLocked: false,
    isPendingAllowance: false,
    isPendingApproval: false,
    isProcessing: false,
    isTokenChainSameToTargetChain: false,
    step: CrosschainBridgeStep.SELECT_ROUTE,
}

export const DEFAULT_EVM_TO_TON_TRANSFER_STORE_DATA: EvmTransferStoreData = {
    amount: '',
    deriveEventAddress: undefined,
    eventVoteData: undefined,
    leftAddress: undefined,
    rightAddress: undefined,
    token: undefined,
}

export const DEFAULT_EVM_TO_TON_TRANSFER_STORE_STATE: EvmTransferStoreState = {
    eventState: undefined,
    isCheckingTransaction: false,
    prepareState: undefined,
    transferState: undefined,
}

export const DEFAULT_EVM_SWAP_TRANSFER_STORE_DATA: EvmSwapTransferStoreData = {
    amount: '',
    creditProcessorAddress: undefined,
    deriveEventAddress: undefined,
    eventVoteData: undefined,
    leftAddress: undefined,
    rightAddress: undefined,
    token: undefined,
}

export const DEFAULT_EVM_SWAP_TRANSFER_STORE_STATE: EvmSwapTransferStoreState = {
    creditProcessorState: undefined,
    eventState: undefined,
    isCheckingTransaction: false,
    prepareState: undefined,
    transferState: undefined,
    swapState: undefined,
}

export const DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_DATA: EvmHiddenSwapTransferStoreData = {
    amount: '',
    creditProcessorAddress: undefined,
    deriveEventAddress: undefined,
    eventVoteData: undefined,
    leftAddress: undefined,
    maxTransferFee: undefined,
    minTransferFee: undefined,
    rightAddress: undefined,
    token: undefined,
}

export const DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_STATE: EvmHiddenSwapTransferStoreState = {
    creditProcessorState: undefined,
    eventState: undefined,
    isCheckingTransaction: false,
    prepareState: undefined,
    transferState: undefined,
    swapState: undefined,
}

export const DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA: EverscaleTransferStoreData = {
    amount: '',
    chainId: undefined,
    encodedEvent: undefined,
    leftAddress: undefined,
    rightAddress: undefined,
    token: undefined,
    withdrawalId: undefined,
}

export const DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE: EverscaleTransferStoreState = {
    eventState: undefined,
    isCheckingContract: false,
    prepareState: undefined,
    releaseState: undefined,
}

export const DEFAULT_TRANSFER_SUMMARY_STORE_DATA: TransferSummaryData = {}

export const DEFAULT_TRANSFER_SUMMARY_STORE_STATE: TransferSummaryState = {
    isTransferPage: false,
}
