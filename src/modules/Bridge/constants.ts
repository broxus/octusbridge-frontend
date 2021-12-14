import BigNumber from 'bignumber.js'

import { BridgeConstants, DexConstants } from '@/misc'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    EvmHiddenSwapTransferStoreData,
    EvmHiddenSwapTransferStoreState,
    EvmSwapTransferStoreData,
    EvmSwapTransferStoreState,
    EvmTransferStoreData,
    EvmTransferStoreState,
    TonTransferStoreData,
    TonTransferStoreState,
    TransferSummaryData, TransferSummaryState,
} from '@/modules/Bridge/types'


export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA: CrosschainBridgeStoreData = {
    amount: '',
    bridgeFee: undefined,
    depositType: 'default',
    creditFactoryFee: undefined,
    leftAddress: '',
    leftNetwork: undefined,
    minAmount: undefined,
    maxTokenAmount: undefined,
    maxTonsAmount: undefined,
    maxTransferFee: undefined,
    minReceiveTokens: undefined,
    minTonsAmount: undefined,
    minTransferFee: undefined,
    pairAddress: undefined,
    pairState: undefined,
    rightAddress: '',
    rightNetwork: undefined,
    selectedToken: undefined,
    swapType: '0',
    tokenAmount: undefined,
    tonsAmount: undefined,
    txHash: undefined,
}

export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE: CrosschainBridgeStoreState = {
    approvalStrategy: 'infinity',
    isSwapEnabled: false,
    isPendingAllowance: false,
    isPendingApproval: false,
    isProcessing: false,
    step: CrosschainBridgeStep.SELECT_ROUTE,
}

export const DEFAULT_EVM_TO_TON_TRANSFER_STORE_DATA: EvmTransferStoreData = {
    amount: '',
    deriveEventAddress: undefined,
    ethConfigAddress: undefined,
    eventVoteData: undefined,
    leftAddress: undefined,
    rightAddress: undefined,
    token: undefined,
}

export const DEFAULT_EVM_TO_TON_TRANSFER_STORE_STATE: EvmTransferStoreState = {
    eventState: undefined,
    prepareState: undefined,
    transferState: undefined,
}

export const DEFAULT_EVM_SWAP_TRANSFER_STORE_DATA: EvmSwapTransferStoreData = {
    amount: '',
    creditProcessorAddress: undefined,
    deriveEventAddress: undefined,
    ethConfigAddress: undefined,
    eventVoteData: undefined,
    leftAddress: undefined,
    rightAddress: undefined,
    token: undefined,
}

export const DEFAULT_EVM_SWAP_TRANSFER_STORE_STATE: EvmSwapTransferStoreState = {
    creditProcessorState: undefined,
    eventState: undefined,
    prepareState: undefined,
    transferState: undefined,
    swapState: undefined,
}

export const DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_DATA: EvmHiddenSwapTransferStoreData = {
    amount: '',
    creditProcessorAddress: undefined,
    deriveEventAddress: undefined,
    ethConfigAddress: undefined,
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
    prepareState: undefined,
    transferState: undefined,
    swapState: undefined,
}

export const DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA: TonTransferStoreData = {
    amount: '',
    chainId: undefined,
    encodedEvent: undefined,
    leftAddress: undefined,
    rightAddress: undefined,
    token: undefined,
    withdrawalId: undefined,
}

export const DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE: TonTransferStoreState = {
    eventState: undefined,
    isContractDeployed: false,
    prepareState: undefined,
    releaseState: undefined,
}

export const DEFAULT_TRANSFER_SUMMARY_STORE_DATA: TransferSummaryData = {
    amount: '',
    leftAddress: '',
    rightAddress: '',
}

export const DEFAULT_TRANSFER_SUMMARY_STORE_STATE: TransferSummaryState = {
    isTransferPage: false,
}

export const EMPTY_WALLET_MIN_TONS_AMOUNT = new BigNumber(
    BridgeConstants.EmptyWalletMinTonsAmount,
).shiftedBy(-DexConstants.TONDecimals)
