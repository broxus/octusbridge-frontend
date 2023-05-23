import { type DecodedAbiFunctionInputs } from 'everscale-inpage-provider'

import { type BridgeAbi } from '@/misc'
import { type Pipeline } from '@/models'
import { type BridgeAsset } from '@/stores/BridgeAssetsService'
import { type NetworkShape, type NetworkType } from '@/types'

export type ApprovalStrategies = 'infinity' | 'fixed'

export enum CrosschainBridgeStep {
    SELECT_ROUTE,
    SELECT_ASSET,
    SELECT_APPROVAL_STRATEGY,
    TRANSFER,
}

export type CrosschainBridgeStoreData = {
    amount: string
    bridgeFee?: string
    eventInitialBalance?: string
    eversAmount?: string
    everscaleEvmCost?: string
    evmEverscaleCost?: string
    gasPrice?: string
    hiddenBridgePipeline?: Pipeline
    leftAddress: string
    leftNetwork?: NetworkShape
    maxEversAmount?: string
    maxTransferFee?: string
    minEversAmount?: string
    minTransferFee?: string
    pipeline?: Pipeline
    rightAddress: string
    rightNetwork?: NetworkShape
    selectedToken?: string
    txHash?: string
    txPrice?: string
    pendingWithdrawals?: PendingWithdrawal[]
}

export type CrosschainBridgeStoreState = {
    approvalStrategy: ApprovalStrategies
    isCalculating: boolean
    isFetching: boolean
    isLocked: boolean
    isPendingAllowance: boolean
    isPendingApproval: boolean
    isProcessing: boolean
    isSwapEnabled?: boolean
    step: CrosschainBridgeStep
    evmPendingWithdrawal?: EvmPendingWithdrawal
}

export type AddressesFields = Pick<CrosschainBridgeStoreData, 'leftAddress' | 'rightAddress'>

export type EvmEventVoteData = DecodedAbiFunctionInputs<typeof BridgeAbi.EthereumEverscaleEventConfiguration, 'deployEvent'>['eventVoteData']

export type SolanaEventVoteData = DecodedAbiFunctionInputs<typeof BridgeAbi.SolanaEverscaleEventConfiguration, 'deployEvent'>['eventVoteData']

export type NetworkFields = Pick<CrosschainBridgeStoreData, 'leftNetwork' | 'rightNetwork'>

export type EventStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type PrepareStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type ReleaseStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type SwapStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type TransferStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'


export type TransferUrlBaseParams = {
    fromId: string;
    fromType: NetworkType;
    toId: string;
    toType: NetworkType;
}

export type EvmTransferUrlParams = TransferUrlBaseParams & {
    txHash: string;
}

export type EverscaleTransferUrlParams = TransferUrlBaseParams & {
    contractAddress: string;
}

export type SolanaTransferUrlParams = TransferUrlBaseParams & {
    txSignature: string;
}

export type TransferSummaryData = {
    amount?: string
    bridgeFee?: string
    depositType?: string
    depositFee?: string
    eversAmount?: string
    everscaleAddress?: string
    gasPrice?: string
    everscaleEvmCost?: string
    evmEverscaleCost?: string
    hiddenBridgePipeline?: Pipeline
    leftAddress?: string
    leftNetwork?: NetworkShape
    maxTransferFee?: string
    minTransferFee?: string
    pipeline?: Pipeline
    rightAddress?: string
    rightNetwork?: NetworkShape
    swapAmount?: string
    token?: BridgeAsset
    tokenAmount?: string
    withdrawFee?: string
    pendingWithdrawals?: PendingWithdrawal[]
    txAddress: string
    success?: boolean
}

export type TransferSummaryState = {
    isTransferPage?: boolean
    isTransferReleased?: boolean
}

export enum BurnCallbackOrdering {
    AMOUNT_EXEC_ASCENDING = 'amountexecascending',
    AMOUNT_EXEC_DESCENDING = 'amountexecdescending',
    CREATED_AT_ASCENDING = 'createdatascending',
    CREATED_AT_DESCENDING = 'createdatdescending',
}

export type SearchBurnCallbackInfoRequest = {
    amountGe?: string;
    amountLe?: string;
    callId?: number;
    chainId?: number;
    createdAtGe?: number;
    createdAtLe?: number;
    creditProcessorAddress?: string;
    ethUserAddress?: string;
    limit: number;
    offset: number;
    ordering?: BurnCallbackOrdering;
    proxyAddress?: string;
    tonEventUserAddress?: string;
}

export type BurnCallbackInfoResponse = {
    amount: string;
    burnCallbackTimestampLt: number;
    callId: number;
    chainId: number;
    createdAt: number;
    creditProcessorAddress?: string;
    ethUserAddress: string;
    proxyAddress: string;
    tonEventContractAddress?: string;
    tonTransactionHash?: string;
    userAddress?: string;
}

export type BurnCallbackTableResponse = {
    totalCount: number;
    transfers: BurnCallbackInfoResponse[];
}

export type PendingWithdrawalStatus = 'Close' | 'Open'

export type PendingWithdrawal = {
    id: string;
    amount: string;
    bounty: string;
    recipient: string;
    timestamp?: string;
    approveStatus?: string;
}

export type PendingWithdrawalId = {
    recipient: string;
    id: string;
}

export type EvmPendingWithdrawal = {
    chainId: string;
    evmTokenAddress: string;
    withdrawalIds: PendingWithdrawalId[];
}
